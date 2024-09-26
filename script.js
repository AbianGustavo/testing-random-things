let totalGeneral = 0;
const totalesPorCategoria = {};

function cargarDatos() {
    const datos = JSON.parse(localStorage.getItem('gastos'));
    if (datos) {
        for (const categoria in datos) {
            for (const monto of datos[categoria]) {
                agregarGasto(categoria, monto, false); 
            }
        }
    }
}

document.getElementById('agregar').addEventListener('click', function() {
    const categoriaInput = document.getElementById('categoria');
    const montoInput = document.getElementById('monto');
    const categoria = categoriaInput.value.trim();
    const monto = parseFloat(montoInput.value);

    if (categoria && !isNaN(monto) && monto > 0) {
        agregarGasto(categoria, monto);

        categoriaInput.value = '';
        montoInput.value = '';
    } else {
        alert('Por favor, introduce una categoría y un monto válido.');
    }
});

function agregarGasto(categoria, monto, actualizarStorage = true) {
    totalGeneral += monto;
    document.getElementById('total-general').innerText = totalGeneral.toFixed(2);

    if (!totalesPorCategoria[categoria]) {
        totalesPorCategoria[categoria] = [];
    }
    totalesPorCategoria[categoria].push(monto);

    const li = document.createElement('li');
    li.textContent = `${categoria}: +${monto.toFixed(2)} €`;

    const eliminarBtn = document.createElement('span');
    eliminarBtn.textContent = '   ❌';
    eliminarBtn.className = 'eliminar';
    eliminarBtn.onclick = function() {
        eliminarGasto(categoria, monto, li);
    };
    li.appendChild(eliminarBtn);

    document.getElementById('lista-gastos').appendChild(li);

    actualizarTotalesPorCategoria();

    if (actualizarStorage) {
        localStorage.setItem('gastos', JSON.stringify(totalesPorCategoria));
    }
}

function eliminarGasto(categoria, monto, li) {
    totalGeneral -= monto;
    document.getElementById('total-general').innerText = totalGeneral.toFixed(2);

    const index = totalesPorCategoria[categoria].indexOf(monto);
    if (index > -1) {
        totalesPorCategoria[categoria].splice(index, 1);
    }

    document.getElementById('lista-gastos').removeChild(li);

    actualizarTotalesPorCategoria();

    localStorage.setItem('gastos', JSON.stringify(totalesPorCategoria));
}

function actualizarTotalesPorCategoria() {
    const listaTotales = document.getElementById('totales-categorias');
    listaTotales.innerHTML = ''; 

    for (const categoria in totalesPorCategoria) {
        const totalCategoria = totalesPorCategoria[categoria].reduce((sum, monto) => sum + monto, 0);
        const li = document.createElement('li');
        li.textContent = `${categoria}: ${totalCategoria.toFixed(2)} €`;
        listaTotales.appendChild(li);
    }
}

document.getElementById('borrar-todo').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas borrar todos los gastos?')) {
        localStorage.removeItem('gastos');
        totalGeneral = 0;
        document.getElementById('total-general').innerText = totalGeneral.toFixed(2);
        document.getElementById('lista-gastos').innerHTML = '';
        document.getElementById('totales-categorias').innerHTML = '';
        for (const categoria in totalesPorCategoria) {
            totalesPorCategoria[categoria] = [];
        }
    }
});

cargarDatos();
