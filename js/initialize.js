let playerElements = document.getElementsByClassName('grid-container')[0].children;
let players = [];
const colors = ['#e20068', '#5300d8', '#4eca00'];
var fillSVG = '<svg class="waves" style="width:100%;height:100%;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto"><defs><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" /></defs><g class="parallax"><use xlink:href="#gentle-wave" x="48" y="2" fill="AAA" /><use xlink:href="#gentle-wave" x="48" y="4" fill="BBB" /></g></svg>'
function setBarColor(bar, color){
    var bgColor = shadeColor(color, -30);
    bar.element.getElementsByTagName('svg')[0].outerHTML = fillSVG.replace('AAA', shadeColor(color, 0)).replace('BBB', shadeColor(color, 30));
    bar.element.children[0].style.backgroundColor = bgColor;
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
    // const fill = document.createElement('div');
    const fill = document.createElement('div');
    fill.classList.add('bar-fill');
    newBar.appendChild(fill);
    const svg = document.createElement('svg');
    fill.appendChild(svg);

    // CALCULATE DEFAULT ATTRIBUTES / SKIP IF OPTIONS GIVEN
    const totalBars = bars.children.length;
    const color = colors[totalBars % 3] || options.color;
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
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-bar');
    deleteButton.innerHTML = '<i data-feather="trash-2"></i>';
    form.appendChild(colorInput);
    form.appendChild(maxInput);
    form.appendChild(currentInput);
    form.appendChild(deleteButton);
    colorInput.addEventListener('change', () => {
        bar.color = colorInput.value;
        setBarColor(bar, colorInput.value);
        saveState();
    });
    maxInput.addEventListener('change', () => {
        bar.max = maxInput.value;
        setBarWidth(bar);
        saveState();
    });
    currentInput.addEventListener('change', () => {
        bar.current = currentInput.value;
        setBarWidth(bar);
        saveState();
    });
    deleteButton.addEventListener('click', e => {
        e.preventDefault();
        bar.element.remove();
        console.log(bar);
        saveState();
    });
    form.style.display = 'none';
    bar.element.addEventListener('click', () => {
        hideForms();
        toggleForm(form);
    });
    return form;
}

function bindInputs(playerElement, player){
    const button = playerElement.getElementsByTagName('button')[0];
    const nameInput = playerElement.getElementsByTagName('input')[0];

    button.addEventListener('click', () => {
        createBar(playerElement);
        feather.replace();
        saveState();
    });

    nameInput.addEventListener('change', () => {
        player.name = nameInput.value;
        saveState();
    })
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
            bindInputs(player);
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
        if(player.name)
            player.element.getElementsByTagName('input')[0].value = player.name;
        bindInputs(player.element, player);
        restorePlayerBars(player)
    })
    feather.replace();
}

function restorePlayerBars(player){
    player.bars.forEach(bar => {
        createBar(player.element, bar);
        setBarWidth(bar);
        setBarColor(bar, bar.color);
    });
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

restoreState();