const HTMLNotEmpty = (val) => {
    const tmpEl = document.createElement("div")
    tmpEl.innerHTML = val
    return (tmpEl.innerText.length > 0)
}

export {
    HTMLNotEmpty
}