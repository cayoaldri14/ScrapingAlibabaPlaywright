const { chromium } = require('playwright');

async function main() {

    // ABRIR NAVEGADOR

    const navegador = await chromium.launch({
        headless: false
    });

    const pagina = await navegador.newPage();

    // ABRIR ALIBABA

    await pagina.goto('https://www.alibaba.com/product-detail/Customize-Gift-Box-OTT-Tv-Box_1601560981238.html?spm=a2700.product_home_fy25.just_for_you.1.40191061KkySOy&priceId=5cbf5c41e1124953a5db52f51f349d9b', {
        waitUntil: 'domcontentloaded'
    });

    // Esperar a que cargue la página
    await pagina.waitForTimeout(5000);

    // OBTENER TÍTULO
    
    const titulo = await pagina.title();

    // OBTENER TEXTO DE LA PÁGINA

    const contenido = await pagina.locator('body').innerText();

    const lineas = contenido.split('\n');

    // BUSCAR MOQ

    let moq = 'No encontrado';

    for (let linea of lineas) {

        linea = linea.trim();

        if (linea.toLowerCase().startsWith('moq:')) {

            moq = linea.replace(/MOQ:/i, '').trim();

            break;
        }
    }

    // BUSCAR PRECIO

    let precio = 'No encontrado';

    for (let linea of lineas) {

        linea = linea.trim();

        if (
            linea.includes('Bs') ||
            linea.includes('BOB')
        ) {

            precio = linea;

            break;
        }
    }

    // BUSCAR PESO BRUTO

    let peso = 'No encontrado';

    for (let i = 0; i < lineas.length; i++) {

        let linea = lineas[i].trim();

        if (
            linea.toLowerCase() === 'peso bruto' ||
            linea.toLowerCase() === 'gross weight'
        ) {

            // Buscar el siguiente texto que contenga kg
            for (let j = i + 1; j < lineas.length; j++) {

                let valor = lineas[j].trim();

                if (valor.toLowerCase().includes('kg')) {

                    peso = valor;

                    break;
                }
            }

            if (peso !== 'No encontrado') {
                break;
            }
        }
    }

    // BUSCAR TAMAÑO DEL PAQUETE

    let dimensiones = 'No encontradas';

    for (let i = 0; i < lineas.length; i++) {

        let linea = lineas[i].trim();

        if (
            linea.toLowerCase() === 'tamaño del paquete' ||
            linea.toLowerCase() === 'package size'
        ) {

            // Buscar el siguiente texto que contenga cm
            for (let j = i + 1; j < lineas.length; j++) {

                let valor = lineas[j].trim();

                if (
                    valor.toLowerCase().includes('cm') ||
                    valor.toLowerCase().includes('mm')
                ) {

                    dimensiones = valor;

                    break;
                }
            }

            if (dimensiones !== 'No encontradas') {
                break;
            }
        }
    }

    // MOSTRAR RESULTADOS

    console.log('');
    console.log('========================================');
    console.log('             PRODUCTO');
    console.log('========================================');

    console.log('Título:', titulo);
    console.log('Precio:', precio);
    console.log('MOQ:', moq);
    console.log('Peso bruto:', peso);
    console.log('Tamaño del paquete:', dimensiones);

    console.log('========================================');

    // CERRAR NAVEGADOR

    await navegador.close();
}

main();