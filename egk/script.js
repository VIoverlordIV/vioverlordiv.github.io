const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// 全局变量，默认值如下：
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

// 设置画布背景为白色（导出图片时背景不会透明）
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // 设置回当前选中的画笔颜色
}

// 页面加载时初始化画布宽高和背景
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// 绘制矩形函数
const drawRect = (e) => {
    if (!fillColor.checked) {
        // 如果未勾选“填充颜色”，只绘制边框
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    // 否则绘制填充矩形
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

// 绘制圆形函数
const drawCircle = (e) => {
    ctx.beginPath(); // 开始新路径
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // 根据半径绘制圆
    fillColor.checked ? ctx.fill() : ctx.stroke(); // 根据选项决定填充还是只画边框
}

// 绘制三角形函数
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); // 起点
    ctx.lineTo(e.offsetX, e.offsetY); // 第二点
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // 第三点（对称）
    ctx.closePath(); // 自动闭合路径
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

// 鼠标按下时初始化绘制
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth; // 设置线宽
    ctx.strokeStyle = selectedColor; // 设置描边颜色
    ctx.fillStyle = selectedColor;   // 设置填充颜色
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // 保存当前画布状态
}

// 鼠标移动时绘图（根据所选工具）
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); // 恢复快照，避免拖动产生“拖影”

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // 橡皮擦将颜色设为白色，模拟“擦除”
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

// 工具栏按钮绑定点击事件
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;

        // 添加震动类
        btn.classList.add("shake");

        // 一定时间后移除 shake 类（以便下次重新触发动画）
        setTimeout(() => btn.classList.remove("shake"), 200);
    });
});

// 滑块控制画笔粗细
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

// 颜色选项点击事件
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // 移除旧的 selected 类，添加新的
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // 获取当前按钮的背景颜色
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// 颜色选择器改变时更新色块并模拟点击
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// 清空画布按钮点击事件
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

// 保存为图片按钮事件
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; // 以时间戳命名文件
    link.href = canvas.toDataURL(); // 获取当前画布图像数据
    link.click();
});

// 监听画布的鼠标操作
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

// 切换语言菜单显示隐藏
const langBtn = document.querySelector(".lang-btn");
const langMenu = document.querySelector(".lang-menu");

langBtn.addEventListener("click", () => {
  langMenu.style.display = langMenu.style.display === "block" ? "none" : "block";
});

// 点击某语言后关闭菜单（可扩展语言切换逻辑）
langMenu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    alert(`语言切换为：${item.textContent}`);
    langMenu.style.display = "none";
    // 这里你可以添加实际的语言切换逻辑
  });
});

const translations = {
  en: {
    shapes: "Shapes",
    rectangle: "Rectangle",
    circle: "Circle",
    triangle: "Triangle",
    fillColor: "Fill color",
    options: "Options",
    brush: "Brush",
    eraser: "Eraser",
    colors: "Colors",
    clear: "Clear Canvas",
    save: "Save As Image"
  },
  jp: {
    shapes: "図形",
    rectangle: "四角形",
    circle: "円",
    triangle: "三角形",
    fillColor: "塗りつぶし",
    options: "オプション",
    brush: "ブラシ",
    eraser: "消しゴム",
    colors: "色",
    clear: "キャンバスをクリア",
    save: "画像として保存"
  },
  zh: {
    shapes: "图形",
    rectangle: "矩形",
    circle: "圆形",
    triangle: "三角形",
    fillColor: "填充颜色",
    options: "选项",
    brush: "画笔",
    eraser: "橡皮擦",
    colors: "颜色",
    clear: "清除画布",
    save: "保存为图片"
  }
};
function updateLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key];
  });
}
langMenu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    const lang = item.getAttribute("data-lang");
    updateLanguage(lang); // 切换语言
    langMenu.style.display = "none";
  });
});

const cursorTrailContainer = document.getElementById("cursor-trail");

window.addEventListener("mousemove", (e) => {
  const dot = document.createElement("div");
  dot.className = "trail-dot";
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
  cursorTrailContainer.appendChild(dot);

  // 删除粒子，避免内存累积
  setTimeout(() => {
    dot.remove();
  }, 600);
});
