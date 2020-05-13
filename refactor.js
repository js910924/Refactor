function statement(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer;
	statementData.performances = invoice.performances.map(enrichPerformance);
	return renderPlainText(statementData);

	function enrichPerformance(aPerformance) {
		const result = Object.assign({}, aPerformance);
		result.play = playFor(result);
		return result;
	}

	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}
}

function renderPlainText(data) {
	let result = `Statement for ${data.customer}\n`;
	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(getAmount(perf) / 100)} (${perf.audience} seats)\n`;
	}
	result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
	result += `You earned ${totalVolumnCredits()} credits\n`;
	return result;

	function totalAmount() {
		let totalAmount = 0;
		for (let perf of data.performances) {
			totalAmount += getAmount(perf);
		}
		return totalAmount;
	}

	function totalVolumnCredits() {
		let volumnCredits = 0;
		for (let perf of data.performances) {
			volumnCredits += volumnCreditsFor(perf);
		}
		return volumnCredits;
	}

	function usd(aNumber) {
		return new Intl.NumberFormat("en-US", {
			style: "currency", currency: "USD",
			minimunFractionDigits: 2
		}).format(aNumber);
	}

	function volumnCreditsFor(aPerformance) {
		let volumnCredits = 0;
		volumnCredits += Math.max(aPerformance.audience - 30, 0);
		if ("comedy" === aPerformance.play.type)
			volumnCredits += Math.floor(aPerformance.audience / 5);
		return volumnCredits;
	}

	function getAmount(aPerformance) {
		let amount = 0;
		switch (aPerformance.play.type) {
			case "tragedy":
				amount = 40000;
				if (aPerformance.audience > 30) {
					amount += 1000 * (aPerformance.audience - 30);
				}
				break;
			case "comedy":
				amount = 30000;
				if (aPerformance.audience > 20) {
					amount += 10000 + 500 * (aPerformance.audience - 20);
				}
				amount += 300 * aPerformance.audience;
				break;
			default:
				throw new Error(`unknown type: ${aPerformance.play.type}`);
		}
		return amount;
	}
}

function readJsonFileAndDeserialize(jsonFile) {
	let fs = require('fs');
	return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
}

function should_get_corresponding_result_when_call_statement() {
	let invoice = readJsonFileAndDeserialize('invoices.json');
	let plays = readJsonFileAndDeserialize('plays.json');

	let expected = "Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits\n";
	if (statement(invoice, plays) === expected) {
		console.log("Good Job!");
	} else {
		console.log("[Result]");
		console.log(statement(invoice, plays));
		console.log("[Expected]");
		console.log(expected);
	}
}

should_get_corresponding_result_when_call_statement();
