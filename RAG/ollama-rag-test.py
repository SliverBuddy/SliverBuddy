import streamlit as st  # 導入 Streamlit 庫，用於建立網頁應用
import ollama  # 導入 ollama 庫，用於自然語言處理
import chromadb  # 導入 chromadb 庫，用於數據存儲和查詢
import pandas as pd  # 導入 pandas 庫，用於數據分析和處理

# 定義一個初始化函數，用於設置 Streamlit 的會話狀態
def initialize():
    # 檢查 'session_state'（會話狀態）中是否已有 'already_executed' 這個變量
    # 這個變量用來檢查是否已經進行過一次資料庫初始化操作
    if "already_executed" not in st.session_state:
        st.session_state.already_executed = False  # 若不存在，則設置為 False

    # 如果 'already_executed' 為 False，表示還未初始化過資料庫
    if not st.session_state.already_executed:
        setup_database()  # 呼叫 setup_database 函數來進行資料庫的設置和數據加載

# 設置資料庫
def setup_database():
    client = chromadb.PersistentClient(path="./chromadb_data")  # 使用 PersistentClient 避免數據丟失
    file_path = 'QA50.xlsx'
    
    try:
        documents = pd.read_excel(file_path, header=None)
    except FileNotFoundError:
        st.error(f"文件 {file_path} 未找到，請確保它在當前目錄下。")
        return

    collection = client.get_or_create_collection(name="demodocs")

    for index, row in documents.iterrows():
        text = str(row[0])  # 確保數據是字符串格式
        response = ollama.embeddings(model="mxbai-embed-large", prompt=text)
        collection.add(ids=[str(index)], embeddings=[response["embedding"]], documents=[text])

    st.session_state.already_executed = True
    st.session_state.collection = collection

# 創建新的 chromadb 客戶端
def create_chromadb_client():
    return chromadb.PersistentClient(path="./chromadb_data")

# 主函數
def main():
    initialize()
    st.title("我的第一個LLM+RAG本地知識問答")
    user_input = st.text_input("請輸入您的問題")

    if st.button("送出"):
        if user_input:
            handle_user_input(user_input, st.session_state.collection)
        else:
            st.warning("請輸入問題！")

# 處理用戶輸入
def handle_user_input(user_input, collection):
    response = ollama.embeddings(model="mxbai-embed-large", prompt=user_input)
    results = collection.query(query_embeddings=[response["embedding"]], n_results=3)

    if results["documents"]:
        data = results["documents"][0]
        output = ollama.generate(
            model="cwchang/llama-3-taiwan-8b-instruct:latest",
            prompt=f"使用這些數據: {data} 來回答這個問題: {user_input}",
        )
        st.text("回答：")
        st.write(output["response"])
    else:
        st.warning("找不到相關資料，請嘗試不同的問題。")

if __name__ == "__main__":
    main()
