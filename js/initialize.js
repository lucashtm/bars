let playerElements = document.getElementsByClassName('grid-container')[0].children;
let players = [];
const colors = ['#e20068', '#5300d8', '#4eca00'];

function setBarColor(bar, color){
    bar.element.children[0].style.backgroundColor = color;
}

function setBarWidth(bar){
    const width = 100*bar.current/bar.max;
    bar.element.getElementsByTagName('span')[0].innerHTML = `${bar.current}/${bar.max}`;
    bar.element.children[0].style.width = `${width}%`;
}

function createBar(player, options){

    // CREATE BAR HTML
    const bars = player.getElementsByClassName('bars')[0];
    const newBar = document.createElement('div');
    newBar.classList.add('bar');
    const fill = document.createElement('div');
    fill.classList.add('bar-fill');
    newBar.appendChild(fill);

    // CALCULATE DEFAULT ATTRIBUTES / SKIP IF OPTIONS GIVEN
    const totalBars = bars.children.length;
    const color = colors[totalBars % 3];
    const virtualPlayer = players.find(element => element.id == player.id);
    var virtualBar;
    if(!options){
        virtualBar = createVirtualBar(virtualPlayer, newBar, {max: 100, current: 100, color});
    }else{
        virtualBar = options;
        virtualBar.element = newBar
    }
    const text = createBarText(virtualBar);
    newBar.appendChild(text);
    setBarColor(virtualBar, color);

    // APPLY BAR
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
        bar.color = colorInput.value;
        setBarColor(bar, colorInput.value);
        saveState()
    });
    maxInput.addEventListener('change', () => {
        bar.max = maxInput.value;
        setBarWidth(bar);
        saveState()
    });
    currentInput.addEventListener('change', () => {
        bar.current = currentInput.value;
        setBarWidth(bar);
        saveState()
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
        saveState();
    });
}

function createVirtualBar(player, barElement, options){
    const bar = {
        element: barElement,
        max: options.max,
        current: options.current,
        color: options.color
    };
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

function saveState(){
    localStorage.setItem('baseStructure', JSON.stringify(players));
}

function restoreState(){
    playerElements = document.getElementsByClassName('grid-container')[0].children;
    savedState = JSON.parse(localStorage.getItem('baseStructure'));
    if(!savedState){
        for (const player of playerElements) {
            bindButton(player);
            players.push({
                id: player.id,
                element: player,
                bars: []
            });
        }
        return;
    }
    players = savedState;
    players.forEach(player => {
        player.element = document.getElementById(player.id);
        bindButton(player.element);
        restorePlayerBars(player)
    })
}

function restorePlayerBars(player){
    player.bars.forEach(bar => {
        createBar(player.element, bar);
        setBarWidth(bar);
        setBarColor(bar, bar.color);
    });
}

restoreState();