window.myApi.handleSlctDir((evt, val) => {
    const dirPath = document.getElementById("dirPath");
    dirPath.value = val;
});

window.myApi.handleFileList((evt, val) => {
    const oldList = document.getElementById("oldList");
    oldList.innerHTML = "";
    val.forEach(elm => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.innerText = elm;
        oldList.appendChild(li);
    });
});

window.myApi.handleNewList((evt, val) => {
    const newList = document.getElementById("newList");
    newList.innerHTML = "";
    val.forEach(elm => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.innerText = elm;
        newList.appendChild(li);
    })
});

window.myApi.handleRenameDone((evt) => {
    const renameBtn = document.getElementById("renameBtn");
    alert("リネームが完了しました");
    renameBtn.classList.remove("disabled");
});

window.myApi.handleRenameFail((evt) => {
    const renameBtn = document.getElementById("renameBtn");
    alert("リネームが失敗しました");
    renameBtn.classList.remove("disabled");
});

window.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openBtn");
    const renameBtn = document.getElementById("renameBtn");
    openBtn.addEventListener("click", () => {
        window.myApi.openSlctDirDialog();
    });
    renameBtn.addEventListener("click", () => {
        if (confirm("リネームしますか？")) {
            renameBtn.classList.add("disabled");
            window.myApi.execRename();
        }
    });
});