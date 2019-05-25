const algorithmia = require('algorithmia')
const algoritmiaApiKey = require('../credentials/algorithmia.json').apiKey

async function robot (content){
	await fetchContentFromWikipedia(content)
	sanitizeContent(content)
	//breakContentIntoSetences(content)
	
	async function fetchContentFromWikipedia (content) {
		const algorithmiaAuthenticated = algorithmia(algoritmiaApiKey)
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
		const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
		const wikipediaContent = wikipediaResponse.get()

		content.sourceContentOriginal = wikipediaContent.content
	}

	function sanitizeContent (content) {
		const withoutBlankLines = removeBlankLines(content.sourceContentOriginal)

		function removeBlankLines (text) {
			const allLines = text.split('\n')
			console.log(allLines)
		}
	}
}

module.exports = robot
