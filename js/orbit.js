window.initLogoOrbit = function () {
    const container = document.querySelector('.flip-card-container');
    if (!container) return;

    // 初始半径
    const settings = { radius: 180 };

    // 配置各Logo的动画参数 (对应原CSS中的时长和延迟)
    // progress = |delay| / duration
    const logos = [
        { sel: '.logo-1', dur: 15, prog: 0 },         // 15s
        { sel: '.logo-2', dur: 20, prog: 5 / 20 },      // 20s, -5s
        { sel: '.logo-3', dur: 25, prog: 10 / 25 },     // 25s, -10s
        { sel: '.logo-4', dur: 18, prog: 8 / 18 },      // 18s, -8s
    ];

    const tweens = [];

    logos.forEach(conf => {
        const el = container.querySelector(conf.sel);
        if (!el) return;

        // 使用一个代理对象来驱动角度变化
        const proxy = { angle: 0 };

        // 创建主旋转动画
        const t = gsap.to(proxy, {
            angle: 360,
            duration: conf.dur,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                const r = settings.radius;
                const a = proxy.angle;
                // 保持 "公转但自转抵消" 的效果: 
                // 先旋转到轨道角度 -> 移动半径距离 -> 反向旋转抵消图片自身的旋转
                el.style.transform = `rotate(${a}deg) translateX(${r}px) rotate(-${a}deg)`;
            }
        });

        // 设置初始进度 (模拟 animation-delay)
        t.progress(conf.prog);

        tweens.push(t);
    });

    // Hover 事件监听
    container.addEventListener('mouseenter', () => {
        // 1. 半径变大: 180 -> 225 (增加 1/4)
        gsap.to(settings, {
            radius: 225,
            duration: 0.5,
            ease: "power2.out"
        });

        // 2. 转速变快: timeScale 1 -> 2
        tweens.forEach(t => {
            gsap.to(t, {
                timeScale: 2,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    container.addEventListener('mouseleave', () => {
        // 恢复半径
        gsap.to(settings, {
            radius: 180,
            duration: 0.5,
            ease: "power2.out"
        });

        // 恢复转速
        tweens.forEach(t => {
            gsap.to(t, {
                timeScale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
};
