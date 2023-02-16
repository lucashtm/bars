import tinycolor from "tinycolor2";

var playerElements = document.getElementById('app').children;
let players = [];
const colors = ['#e20068', '#5300d8', '#4eca00'];
var fillSVG = '<svg class="waves" style="width:100%;height:100%;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto"><defs><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" /></defs><g class="parallax"><use xlink:href="#gentle-wave" x="48" y="2" fill="AAA" /><use xlink:href="#gentle-wave" x="48" y="4" fill="BBB" /></g></svg>'
window.setBarColor = (bar, color) => {
    color = tinycolor(color);
    const bgColor = color.darken(15).toHexString();
    const secondColor = color.spin(2).desaturate(20).lighten(10).toHexString();
    const thirdColor = color.spin(2).desaturate(20).lighten(12).toHexString();
    bar.element.getElementsByTagName('svg')[0].outerHTML = fillSVG.replace('AAA', secondColor).replace('BBB', thirdColor);
    bar.element.children[0].style.backgroundColor = bgColor;
}

window.setBarWidth = (bar) => {
    const width = 100*bar.current/bar.max;
    bar.element.getElementsByTagName('span')[0].innerHTML = `${bar.current}/${bar.max}`;
    bar.element.children[0].style.width = `${width}%`;
}

window.createBar = (player, options) => {

    // CREATE BAR HTML
    const playerElement = player.element;
    const bars = playerElement.getElementsByClassName('bars')[0];
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
    const virtualPlayer = players.find(element => element.id == playerElement.id);
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
    const virtualForm = createBarForm(virtualBar, player);
    playerElement.getElementsByClassName('panel')[0].appendChild(virtualForm);
}
 
window.createBarForm = (bar, player=null) => {
    console.log('bar', bar);
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
        const confirmation = confirm('Are you sure?');
        if(confirmation){
            const index = player.bars.indexOf(bar);
            player.bars.splice(index, 1);
            bar.element.remove();
            saveState();
        }
    });
    form.style.display = 'none';
    bar.element.addEventListener('click', () => {
        hideForms();
        toggleForm(form);
    });
    return form;
}

window.bindInputs = (playerElement, player={}) => {
    const button = playerElement.getElementsByTagName('button')[0];
    const nameInput = playerElement.getElementsByTagName('input')[0];
    player.element = playerElement;
    console.log('teste');

    button.addEventListener('click', () => {
        createBar(player);
        feather.replace();
        saveState();
    });

    nameInput.addEventListener('change', () => {
        player.name = nameInput.value;
        saveState();
    })
}

window.createVirtualBar = (player, barElement, options) => {
    const bar = {
        element: barElement,
        max: options.max,
        current: options.current,
        color: options.color
    };
    player.bars.push(bar);
    return bar;
}

window.toggleForm = (form) => {
    if(form.style.display == 'none')
        form.style.display = '';
    else
        form.style.display = 'none';
}

window.hideForms = () => {
    players.forEach(player => {
        const el = document.getElementById(player.id);
        const forms = el.getElementsByClassName('panel')[0].getElementsByTagName('form');
        for (const form of forms) {
            form.style.display = 'none'
        }
    })
}

window.createBarText = (bar) => {
    const span = document.createElement('span');
    const text = document.createTextNode(`${bar.current}/${bar.max}`)
    span.appendChild(text);
    return span;
}

window.saveState = () => {
    localStorage.setItem('baseStructure', JSON.stringify(players));
}

window.restoreState = () => {
    console.log('respore state', playerElements.length);
    const savedState = JSON.parse(localStorage.getItem('baseStructure'));
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

window.restorePlayerBars = (player) => {
    player.bars.forEach(bar => {
        createBar(player, bar);
        setBarWidth(bar);
        setBarColor(bar, bar.color);
    });
}

