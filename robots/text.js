const algorithmia = require('algorithmia')
const algoritmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBondaryDetection = require('sbd')

async function robot (content){
	await fetchContentFromWikipedia(content)
	sanitizeContent(content)
	breakContentIntoSetences(content)
	
	async function fetchContentFromWikipedia (content) {
		const algorithmiaAuthenticated = algorithmia(algoritmiaApiKey)
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
		const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
		const wikipediaContent = wikipediaResponse.get()

		content.sourceContentOriginal = wikipediaContent.content
	}

	function sanitizeContent (content) {
		const withoutBlankLinesAndMarkDown = removeBlankLinesAndRemoveMarkDown(content.sourceContentOriginal)
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkDown)
		
		content.sourceContentSanitized = withoutDatesInParentheses

		function removeBlankLinesAndRemoveMarkDown (text) {
			const allLines = text.split("\n")

			const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
				if (line.trim().length === 0 || line.trim().startsWith('=')){
					return false
				}
				return true
			})
			return withoutBlankLinesAndMarkDown.join(' ')
		}

		function removeDatesInParentheses(text) {
			return text.replace(/\(\)/gm, '').replace('/  /g', ' ')
		}
	}

	function breakContentIntoSetences(content) {
		content.sentences = []

		const sentences = sentenceBondaryDetection.sentences(content.sourceContentSanitized)
		sentences.forEach((sentence) => {
			content.sentences.push({
				text: sentence,
				keywords: [],
				images: []
			})
		})
	}
}

module.exports = robot
