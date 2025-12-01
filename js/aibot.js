const API_URL = "https://bot.robinsong.top/api/chat";

let messageHistory = [];

/**
 * 从 assets/site-data.json 读取数据
 */
async function fetchKnowledgeBase() {   
    try {
        const response = await fetch('./files/botdata.json');
        if (!response.ok) throw new Error("Failed to load knowledge base");
        
        const data = await response.json();
        
        // 构建更详细的 System Prompt
        let prompt = `System Prompt: You are the AI portfolio assistant for ${data.profile.name} (${data.profile.title}), always pretent to be the portfolio owner and keep the answer brief, no more than 50 words. be human-like, use some words for greeting. 
        
[Basic Info]
Intro: ${data.profile.intro}
Skills: ${data.profile.skills.join(", ")}
Contact: ${data.profile.email}
Github: ${data.profile.socials.github}

[Projects Database]
`;
        // 遍历项目，根据字段是否存在动态生成描述
        data.projects.forEach((proj, index) => {
            prompt += `\n### Project ${index + 1}: ${proj.title}`;
            if (proj.subtitle) prompt += ` - ${proj.subtitle}`;
            prompt += `\n   Type: ${proj.category}`;
            prompt += `\n   Description: ${proj.description}`;
            
            if (proj.tech_stack && proj.tech_stack.length > 0) {
                prompt += `\n   Tech Stack: ${proj.tech_stack.join(", ")}`;
            }
            
            if (proj.methodology) {
                prompt += `\n   Methodology: ${proj.methodology}`;
            }
            
            if (proj.outcomes) {
                prompt += `\n   Key Outcomes/Results: ${proj.outcomes}`;
            }
            
            if (proj.details) {
                prompt += `\n   Details: ${proj.details}`;
            }
            
            prompt += `\n`;
        });

        prompt += `\n[Instructions]
1. Answer questions based ONLY on the provided database.
2. If asked about "RL-Building Generator", mention the specific RL algorithms (SAC) and the training steps.
3. If asked about "Seg & Predict", mention the correlation between street views and crime rates.
4. Keep answers professional but conversational.
5. You can reply in English or Chinese based on the user's language.`;

        return prompt;

    } catch (error) {
        console.error("Knowledge Base Error:", error);
        return "System Prompt: You are now Robin Song himself. I am unable to load the detailed database right now, but I can chat generally about your role as a Computational Designer.";
    }
}

// 初始化 Chatbot
window.initChatbot = async function() {
    console.log("Chatbot Initializing...");
    
    // 1. 异步构建 System Prompt
    const systemContext = await fetchKnowledgeBase();
    
    messageHistory = [{ role: "system", content: systemContext }];
    console.log("Knowledge Base Loaded with " + systemContext.length + " chars.");

    // 2. 滚动隔离逻辑
    const chatBox = document.getElementById('chat-box');
    if(chatBox) {
        // 防止滚轮事件冒泡到全屏滚动插件
        chatBox.addEventListener('wheel', (e) => e.stopPropagation(), { passive: false });
        chatBox.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: false });
    }
}

// 开关聊天框
window.toggleChat = function() {
    const box = document.getElementById('chat-box');
    if (!box) return;
    if (box.classList.contains('scale-0')) {
        box.classList.remove('scale-0', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if(input) input.focus();
        }, 300);
    } else {
        box.classList.add('scale-0', 'opacity-0');
        box.classList.remove('scale-100', 'opacity-100');
    }
}

// 发送消息
window.handleChat = async function(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const btn = document.getElementById('chat-send');
    const msg = input.value.trim();
    
    if(!msg) return;

    addMsg(msg, 'user');
    input.value = '';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        messageHistory.push({ role: "user", content: msg });

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messageHistory })
        });

        if (!res.ok) throw new Error("Server error");
        
        const data = await res.json();
        const aiReply = data.reply;

        messageHistory.push({ role: "assistant", content: aiReply });
        addMsg(aiReply, 'ai');

    } catch (err) {
        console.error(err);
        addMsg("Sorry, I can't reach the server right now.", 'ai');
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-arrow-up text-xs"></i>';
        }
    }
}

// 渲染消息
function addMsg(text, sender) {
    const container = document.getElementById('chat-messages');
    if(!container) return;
    
    const div = document.createElement('div');
    div.className = `flex gap-3 chat-bubble-enter ${sender === 'user' ? 'flex-row-reverse' : ''}`;
    
    const avatarColor = sender === 'user' 
        ? 'bg-gray-400' 
        : 'bg-gradient-to-br from-primary-400 to-primary-600 dark:from-magenta-500 dark:to-magenta-700';
        
    const bubbleColor = sender === 'user'
        ? 'bg-primary-500 dark:bg-magenta-600 text-white rounded-tr-none'
        : 'bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-400 text-gray-700 dark:text-gray-200 rounded-tl-none';

    const content = typeof marked !== 'undefined' ? marked.parse(text) : text;

    div.innerHTML = `
        <div class="w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center shrink-0 text-white text-xs">
            ${sender === 'user' ? '<i class="fas fa-user"></i>' : 'AI'}
        </div>
        <div class="${bubbleColor} p-3 rounded-2xl text-sm shadow-sm max-w-[85%] leading-relaxed overflow-hidden">
            ${content}
        </div>
    `;
    
    container.appendChild(div);
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}