from flask import Blueprint, request, jsonify, Response
from flask_cors import CORS
from llama_index.llms.groq import Groq
import time

# Define the blueprint
chatbot = Blueprint("chatbot", __name__)

# Enable CORS
CORS(chatbot)

# Configure LLM
llm = Groq(
    model="Llama3-70b-8192",
    api_key="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",
    temperature=0.7
)

conditions = """
1. **Language Matching**:
   - If the user specifies a language (e.g., "in Spanish"), respond in that language. Ensure correct grammar and spelling in the response.

2. **Greetings and Small Talk**:
   - For greetings like "hi," "hello," "how are you," etc., respond politely and engagingly (e.g., "Hello! How can I assist you today?").
   - For casual or conversational queries, maintain a friendly tone while steering the conversation towards assistance.

3. **Contextual Relevance**:
   - Prioritize answering the query based on the provided context or relevant information.
   - If additional helpful information is available, include it in the response to add value.
   - If the query doesn't match the context, provide general guidance or politely ask for clarification.

4. **Clarity and Conciseness**:
   - Ensure the response is clear, well-structured, and concise.
   - Avoid unnecessary jargon or overly complex language to make the response accessible to all users.

5. **Structure and Formatting**:
   - Begin the response by directly answering the query.
   - Add supporting information if applicable.
   - Include bullet points, numbered lists, or short paragraphs for readability when presenting multiple points.

6. **Error Handling**:
   - If the query is unclear or no relevant information is found, respond politely: 
     - Example: "I couldn't find specific information about your query. Could you provide more details so I can assist you better?"

7. **Additional Query Types**:
   - **Requests for Advice**: Provide actionable and thoughtful suggestions.
   - **Comparisons or Summaries**: Create a side-by-side comparison or a summarized response.
   - **Fact-Based Queries**: Use authoritative sources or context to ensure the information is accurate.

8. **Fallback for Unrecognized Queries**:
   - For unrecognized or off-topic queries, ask clarifying questions like:
     - "Could you provide more details?"
     - "I'm here to help! Could you explain your query further?"

9. **Tone and Personality**:
   - Keep responses polite, professional, and engaging.
   - Inject a warm, helpful personality to create a positive user experience.

10. **Special Scenarios**:
    - If the query includes a date or specific event, confirm whether the information needs to be updated or verified.
    - If technical jargon or expertise is required, provide clear and accurate explanations.

11. **Source Acknowledgment**:
    - If referencing external information or sources, include a brief acknowledgment: 
      - Example: "Based on available data from [source]."

12. **Proactive Assistance**:
    - Anticipate follow-up questions and include suggestions like:
      - "Would you like more details on this topic?"
      - "Let me know if you need further assistance!"

13. **User Feedback**:
    - If the query seems to request user-generated feedback, acknowledge and encourage participation:
      - Example: "Thank you for sharing this! Let me know how else I can help."
"""


@chatbot.route("/chat", methods=["GET"])
def chat():
    """Stream chatbot response with context"""
    query = request.args.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Get context data (replace this with your actual context retrieval logic)
    context = ""  # Initialize empty context
    results = []  # Replace with your actual results retrieval

    if results:  # If you have results to process
        context = "\n".join(result['text'] for result in results)
        print("Context data:", context)

    prompt = f"""
    {conditions}

    ### Context: {context}

    Question: {query}
    Answer:
    """

    def generate():
        try:
            # Stream the response from LLM
            response = llm.stream_complete(prompt)

            for chunk in response:
                yield chunk.delta
                time.sleep(0.05)  # Adjust delay for smooth streaming effect

        except Exception as e:
            yield f"Error: {str(e)}"

    return Response(generate(), mimetype="text/plain")


@chatbot.route("/health", methods=["GET"])
def health_check():
    """Check the API is running"""
    return jsonify({"status": "OK"})