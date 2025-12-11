// 简单的滚动平滑效果
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// 你可以在这里加入更多 JS 动画或交互
console.log("个人主页已加载！");
