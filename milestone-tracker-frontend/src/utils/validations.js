const HTMLNotEmpty = (val) => {
    const tmpEl = document.createElement("div")
    tmpEl.innerHTML = val
    return (tmpEl.innerText.length > 0)
}

const HTMLMinLen = (minLength) => {
    return (val) => {
        const tmpEl = document.createElement("div")
        tmpEl.innerHTML = val
        return (tmpEl.innerText.length > minLength)
    }
}

export {
    HTMLNotEmpty,
    HTMLMinLen
}