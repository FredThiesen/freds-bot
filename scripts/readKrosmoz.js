const axios = require("axios")
const fs = require("fs")

async function lerConteudoPagina(date) {
	const url = `https://www.krosmoz.com/en/almanax/${date}`
	try {
		const response = await axios.get(url)
		return response.data
	} catch (error) {
		console.error("Ocorreu um erro ao acessar a página:", error)
		return null
	}
}

// criar um array com as datas de agosto até o fim de outubro
const datas = []
for (let dia = 1; dia <= 31; dia++) {
	// se data for 1 a 9, adicionar um 0 na frente
	dia = dia < 10 ? `0${dia}` : dia
	datas.push(`2023-08-${dia}`)
}
for (let dia = 1; dia <= 30; dia++) {
	dia = dia < 10 ? `0${dia}` : dia
	datas.push(`2023-09-${dia}`)
}
for (let dia = 1; dia <= 31; dia++) {
	dia = dia < 10 ? `0${dia}` : dia
	datas.push(`2023-10-${dia}`)
}

datas.map((date) => {
	lerConteudoPagina(date)
		.then((conteudo) => {
			if (conteudo) {
				// Aqui você pode fazer o processamento adicional do conteúdo da página

				// extrair de conteudo a string que começa com "Find " e termina com "and"
				const regex = /Find (.*?) and/
				const matches = regex.exec(conteudo)
				const resultado = matches[1]
				//salvar resultado em um arquivo txt

				fs.appendFileSync("resultado.txt", `${date}: ${resultado}\n`)

				console.log(resultado)
			}
		})
		.catch((error) => {
			console.error("Ocorreu um erro:", error)
		})
})
