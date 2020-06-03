const playerElements = document.getElementsByClassName('grid-container')[0].children;
let players = [];
const colors = ['#e20068', '#5300d8', '#4eca00'];

for (const player of playerElements) {
    bindButton(player);
    players.push({
        id: player.id,
        element: player,
        bars: []
    });
}

function setBarColor(bar, color){
    bar.element.children[0].style.backgroundColor = color;
}

function setBarWidth(bar){
    const width = 100*bar.current/bar.max;
    bar.element.getElementsByTagName('span')[0].innerHTML = `${bar.current}/${bar.max}`;
    bar.element.children[0].style.width = `${width}%`;
}

function createBar(player){
    const bars = player.getElementsByClassName('bars')[0];
    const newBar = document.createElement('div');
    newBar.classList.add('bar');
    const fill = document.createElement('div');
    fill.classList.add('bar-fill');
    newBar.appendChild(fill);
    const totalBars = bars.children.length;
    const color = colors[totalBars % 3];
    const virtualPlayer = players.find(element => element.id == player.id);
    const virtualBar = createVirtualBar(virtualPlayer, newBar, {max: 100, current: 100, color});
    const text = createBarText(virtualBar);
    newBar.appendChild(text);
    setBarColor(virtualBar, color);
    bars.appendChild(newBar);
    const virtualForm = createBarForm(virtualBar);
    player.getElementsByClassName('panel')[0].appendChild(virtualForm);
}

function createBarForm(bar){
    const form = document.createElement('form');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = bar.color;
    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.value = bar.max;
    const currentInput = document.createElement('input');
    currentInput.type = 'number';
    currentInput.value = bar.current;
    form.appendChild(colorInput);
    form.appendChild(maxInput);
    form.appendChild(currentInput);
    colorInput.addEventListener('change', () => {
        setBarColor(bar, colorInput.value);
    });
    maxInput.addEventListener('change', () => {
        bar.max = maxInput.value;
        setBarWidth(bar);
    });
    currentInput.addEventListener('change', () => {
        bar.current = currentInput.value;
        setBarWidth(bar);
    });
    form.style.display = 'none';
    bar.element.addEventListener('click', () => {
        hideForms();
        toggleForm(form);
    });
    return form;
}

function bindButton(player){
    const button = player.getElementsByTagName('button')[0];
    button.addEventListener('click', () => {
        createBar(player);
    });
}

function createVirtualBar(player, barElement, options){
    const bar = {
        element: barElement,
        max: options.max,
        current: options.current,
        color: options.color
    }
    player.bars.push(bar);
    return bar;
}

function toggleForm(form){
    if(form.style.display == 'none')
        form.style.display = '';
    else
        form.style.display = 'none';
}

function hideForms(){
    players.forEach(player => {
        const el = document.getElementById(player.id);
        const forms = el.getElementsByClassName('panel')[0].getElementsByTagName('form');
        for (const form of forms) {
            form.style.display = 'none'
        }
    })
}

function createBarText(bar){
    const span = document.createElement('span');
    const text = document.createTextNode(`${bar.current}/${bar.max}`)
    span.appendChild(text);
    return span;
}