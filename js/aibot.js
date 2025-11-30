const API_URL = "https://bot.robinsong.top/api/chat";

function scanWebsiteContent() {
    let content = "System Prompt: You are an AI assistant for Robin Song's portfolio website. Answer questions based on the following parsed website content:\n\n";
    
    const intro = document.querySelector('#intro h1')?.parentElement?.innerText || "";
    content += `[About Robin]: ${intro.replace(/\n/g, ' ')}\n\n`;

    const cadSection = document.getElementById('CAD');
    if (cadSection) {
        content += `[Code / R&D Projects]:\n`;
        cadSection.querySelectorAll('.group').forEach(el => {
            const title = el.querySelector('h3 span.lang-en')?.innerText || "Unknown";
            const desc = el.querySelector('p span.lang-en')?.innerText || "No description";
            content += `- Project: ${title}\n  Description: ${desc}\n`;
        });
        content += "\n";
    }

    const designSection = document.getElementById('projects');
    if (designSection) {
        content += `[Design Projects]:\n`;
        designSection.querySelectorAll('.group').forEach(el => {
            const title = el.querySelector('h3 span.lang-en')?.innerText || "Unknown";
            const desc = el.querySelector('p span.lang-en')?.innerText || "No description";
            content += `- Project: ${title}\n  Description: ${desc}\n`;
        });
    }
    return content;
}

let messageHistory = [];
window.addEventListener('load', () => {
        const systemContext = scanWebsiteContent();
        messageHistory = [{ role: "system", content: systemContext }];
        
        // 🟢 初始化滚动隔离 (防止全屏滚动插件干扰)
        isolateScroll();
});

// ============================================
// 4. 滚动隔离逻辑 (新增强力修复)
// ============================================
function isolateScroll() {
    const chatBox = document.getElementById('chat-box');
    if(!chatBox) return;
    
    // 阻止滚轮事件冒泡，强制让滚轮只在聊天框内生效
    chatBox.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: false });

    // 移动端也需要阻止触摸事件冒泡
    chatBox.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: false });
}

window.toggleChat = function() {
    const box = document.getElementById('chat-box');
    if (box.classList.contains('scale-0')) {
        box.classList.remove('scale-0', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');
        setTimeout(() => document.getElementById('chat-input').focus(), 300);
    } else {
        box.classList.add('scale-0', 'opacity-0');
        box.classList.remove('scale-100', 'opacity-100');
    }
}

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
        if (messageHistory.length === 0) {
                const systemContext = scanWebsiteContent();
                messageHistory = [{ role: "system", content: systemContext }];
        }

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
        addMsg("Sorry, I can't reach the server right now. Make sure the backend is running.", 'ai');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-arrow-up text-xs"></i>';
    }
}

function addMsg(text, sender) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `flex gap-3 chat-bubble-enter ${sender === 'user' ? 'flex-row-reverse' : ''}`;
    
    const avatarColor = sender === 'user' 
        ? 'bg-gray-400' 
        : 'bg-gradient-to-br from-primary-400 to-primary-600 dark:from-magenta-500 dark:to-magenta-700';
        
    const bubbleColor = sender === 'user'
        ? 'bg-primary-500 dark:bg-magenta-600 text-white rounded-tr-none'
        : 'bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-400 text-gray-700 dark:text-gray-200 rounded-tl-none';

    div.innerHTML = `
        <div class="w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center shrink-0 text-white text-xs">
            ${sender === 'user' ? '<i class="fas fa-user"></i>' : 'AI'}
        </div>
        <div class="${bubbleColor} p-3 rounded-2xl text-sm shadow-sm max-w-[85%] leading-relaxed overflow-hidden">
            ${marked.parse(text)}
        </div>
    `;
    
    container.appendChild(div);
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}