import PyPDF2
import faiss
from sentence_transformers import SentenceTransformer
import re
from openai import OpenAI
import numpy as np

class FreeRAGSystem:
    def __init__(self):
        # Free embedding model
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Free vector store
        self.dimension = 384
        self.index = faiss.IndexFlatIP(self.dimension)
        self.chunks = []
        self.metadata = []  # Store page numbers, etc.
        
    def extract_text_from_pdf(self, pdf_path):
        """Extract text using free PDF parser"""
        text = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                # Clean up text - remove excessive whitespace
                page_text = re.sub(r'\s+', ' ', page_text).strip()
                if page_text:  # Only add non-empty pages
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}"
        return text
    
    def smart_chunking(self, text, chunk_size=400, overlap=50):
        """Split text into overlapping chunks with page tracking"""
        print(f"Original text length: {len(text)} characters")
        
        # First split by pages
        pages = text.split('--- Page')
        all_chunks = []
        
        for page_content in pages[1:]:  # Skip first empty split
            if not page_content.strip():
                continue
                
            # Extract page number and content
            page_match = re.match(r'(\d+) ---\s*(.+)', page_content, re.DOTALL)
            if page_match:
                page_num = page_match.group(1)
                page_text = page_match.group(2).strip()
                
                if not page_text:
                    continue
                    
                # Split by sentences for better chunks
                sentences = re.split(r'(?<=[.!?])\s+', page_text)
                
                current_chunk = ""
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue
                        
                    # If adding this sentence exceeds chunk size, save current chunk
                    if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
                        all_chunks.append({
                            'content': current_chunk.strip(),
                            'page': page_num
                        })
                        # Start new chunk with overlap (last 2 sentences)
                        previous_sentences = current_chunk.split('. ')
                        overlap_sentences = previous_sentences[-2:] if len(previous_sentences) > 2 else previous_sentences
                        current_chunk = '. '.join(overlap_sentences) + '. ' + sentence
                    else:
                        if current_chunk:
                            current_chunk += " " + sentence
                        else:
                            current_chunk = sentence
                
                # Don't forget the last chunk of the page
                if current_chunk.strip():
                    all_chunks.append({
                        'content': current_chunk.strip(),
                        'page': page_num
                    })
        
        print(f"Created {len(all_chunks)} chunks")
        return all_chunks
    
    def index_document(self, pdf_path):
        """Process and index PDF document"""
        print("Extracting text from PDF...")
        text = self.extract_text_from_pdf(pdf_path)
        print(f"Extracted {len(text)} characters")
        
        print("Chunking text...")
        chunks_with_meta = self.smart_chunking(text)
        
        if not chunks_with_meta:
            print("Warning: No chunks created from the PDF!")
            return
            
        # Extract just the content for embedding
        chunk_contents = [chunk['content'] for chunk in chunks_with_meta]
        self.chunks = chunk_contents
        self.metadata = chunks_with_meta
        
        print(f"Creating embeddings for {len(chunk_contents)} chunks...")
        embeddings = self.embedder.encode(chunk_contents, normalize_embeddings=True)
        print(f"Embeddings shape: {embeddings.shape}")
        
        print("Building vector index...")
        # Convert to float32 for FAISS and ensure proper shape
        embeddings_float32 = np.array(embeddings, dtype='float32')
        self.index.add(embeddings_float32)
        
        print(f"Indexed {len(chunk_contents)} chunks successfully!")
    
    def search(self, query, top_k=3):
        """Search for relevant chunks"""
        if len(self.chunks) == 0:
            print("No chunks available for search!")
            return []
            
        # Create query embedding
        query_embedding = self.embedder.encode([query], normalize_embeddings=True)
        query_embedding = np.array(query_embedding, dtype='float32')
        
        print(f"Searching among {self.index.ntotal} chunks...")
        
        # Ensure we don't request more chunks than available
        actual_top_k = min(top_k, len(self.chunks))
        
        # Search in vector database
        similarities, indices = self.index.search(query_embedding, actual_top_k)
        
        # Get relevant chunks
        relevant_chunks = []
        for i, idx in enumerate(indices[0]):
            if 0 <= idx < len(self.chunks):  # Safety check
                # Filter out very low similarity results
                similarity_score = float(similarities[0][i])
                if similarity_score > 0.1:  # Only include decent matches
                    relevant_chunks.append({
                        'content': self.chunks[idx],
                        'similarity': similarity_score,
                        'page': self.metadata[idx]['page'] if idx < len(self.metadata) else 'Unknown'
                    })
        
        print(f"Found {len(relevant_chunks)} relevant chunks")
        return relevant_chunks
    
    def query(self, user_query, api_key, top_k=3):
        """Complete RAG pipeline"""
        # 1. Retrieve relevant chunks
        relevant_chunks = self.search(user_query, top_k)
        
        if not relevant_chunks:
            return {
                'answer': "No relevant information found in the document.",
                'sources': [],
                'context_used': ""
            }
        
        # 2. Build context
        context = "\n\n".join([
            f"Source {i+1} (Page {chunk['page']}, similarity: {chunk['similarity']:.3f}):\n{chunk['content']}"
            for i, chunk in enumerate(relevant_chunks)
        ])
        
        # 3. Build RAG prompt
        prompt = f"""Based EXCLUSIVELY on the following document excerpts, answer the user's question.

DOCUMENT EXCERPTS:
{context}

USER QUESTION: {user_query}

INSTRUCTIONS:
1. Answer using ONLY information from the provided excerpts
2. If the answer isn't found, say "I cannot find this information in the document"
3. Be precise and cite which source(s) you used
4. Don't add any external knowledge
5. Keep your answer concise and directly relevant to the question

ANSWER:"""
        
        # 4. Call NVIDIA API using OpenAI client
        try:
            client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=api_key
            )
            
            completion = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,  # Lower temperature for more factual responses
                top_p=0.9,
                max_tokens=1024,  # Reduced for more concise answers
                stream=True
            )
            
            answer = ""
            for chunk in completion:
                # Handle reasoning content if present
                reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
                if reasoning:
                    answer += reasoning
                if chunk.choices[0].delta.content is not None:
                    answer += chunk.choices[0].delta.content
            
            return {
                'answer': answer.strip(),
                'sources': relevant_chunks,
                'context_used': context
            }
            
        except Exception as e:
            return {
                'answer': f"Error calling API: {str(e)}",
                'sources': relevant_chunks,
                'context_used': context
            }

# Debug function to test the system
def debug_system(pdf_path):
    """Test the system step by step"""
    rag = FreeRAGSystem()
    
    print("=== STEP 1: Text Extraction ===")
    text = rag.extract_text_from_pdf(pdf_path)
    print(f"Extracted text sample: {text[:500]}...")
    
    print("\n=== STEP 2: Chunking ===")
    chunks = rag.smart_chunking(text)
    for i, chunk in enumerate(chunks[:3]):  # Show first 3 chunks
        print(f"Chunk {i+1} (Page {chunk['page']}): {chunk['content'][:100]}...")
    
    return len(chunks)

# Usage Example
def main():
    pdf_path = "pdf_test_1.pdf"
    
    # First, debug the system
    print("=== DEBUGGING SYSTEM ===")
    num_chunks = debug_system(pdf_path)
    print(f"\nTotal chunks created: {num_chunks}")
    
    if num_chunks == 0:
        print("ERROR: No chunks created. Check PDF file and text extraction.")
        return
    
    print("\n" + "="*50)
    print("=== MAIN RAG SYSTEM ===")
    
    # Initialize free RAG system
    rag_system = FreeRAGSystem()
    
    # Index your PDF (one-time setup)
    rag_system.index_document(pdf_path)
    
    # Your API key
    API_KEY = "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"
    
    # Test queries
    test_queries = [
        "C'est quoi un faux texte?",
        "Qu'est-ce que Lipsum?",
        "À quoi servent les faux-textes?",
        "Quand les faux-textes ont-ils commencé à être utilisés?"
    ]
    
    for user_question in test_queries:
        print(f"\n❓ QUESTION: {user_question}")
        result = rag_system.query(user_question, API_KEY)
        
        print(f"🤖 ANSWER: {result['answer']}")
        if result['sources']:
            print(f"\n📚 Sources used:")
            for i, source in enumerate(result['sources']):
                print(f"Source {i+1} (Page {source['page']}, similarity: {source['similarity']:.3f}):")
                print(f"   {source['content'][:150]}...")
        print("-" * 80)

if __name__ == "__main__":
    main()