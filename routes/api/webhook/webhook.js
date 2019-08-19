const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

// Petición POST donde trae los datos de ig y los mensajes que desea para el bot
app.post('/:postId', async(req, res) => {
    let body = req.query;
    // El usuario pasa por parametro, la ID del post que desea comentar
    let postId = req.params.postId;
    // hacemos la operación del bot
    try {
        let headers = body.headers; // Mensajes
        let flag = 0; // Contador de cantidad de comentarios que ha enviado
        // Opens the URL in a specified browser
        // Aplicamos el bot
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(`https://www.instagram.com/p/${postId}/`, { waitUntil: 'networkidle2' });
        // Pulsa el botón de entrar
        const loginButton = await page.$x('//button[contains(text(), "Entrar")]');
        await loginButton[0].click();
        // Esperamos la navegación
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        // Hacemos un timeout luego del refresh
        await page.waitFor(3000);
        // Empezamos a hacer el login
        await page.type('input[name=username]', body.username, { delay: 50 }); //carlostrader_
        await page.type('input[name=password]', body.pwd, { delay: 50 });
        // Envia el login a través del botón
        const ButtonSubmit = await page.$x('//div[contains(text(), "Iniciar sesión")]');
        await ButtonSubmit[0].click();
        // Hacemos nuevamente el refresh para empezar a cargar comentarios
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitFor(3000);
        // Creamos el intervalo de tiempo el bot va a escribir
        // Cada minuto va enviar un comentario 
        const businessTimeStamp = setInterval(async() => {
            // 24 horas tiene 1440 comentarios cada minuto
            if (flag >= 1440) {
                // Ya termino la jornada
                clearInterval(businessTimeStamp);
                browser.close();
                return;
            } else {
                // Empezamos a comentar
                await page.type('textarea[class=Ypffh]', RandomText(headers), { delay: 100 });
                // Enviamos el comentario
                const submitMsg = await page.$x('//button[contains(text(), "Publicar")]');
                await submitMsg[0].click();
                flag++;
                console.log(flag);
            }
        }, 40000); // 1 minuto 60000
    } catch (error) {
        throw error;
    }
});

function RandomText(msg) {
    return msg[Math.floor(Math.random() * msg.length)];
}
module.exports = app;