function statement(invoice, plays) {
	let totalAmount = 0;
	let volumnCredits = 0;
	let result = `Statement for ${invoice.customer}\n`;
	const format = new Intl.NumberFormat("en-US",
		{ style: "currency", currency:"USD",
			minimunFractionDigits:2 }).format;
	
	for (let perf of invoice.performances) {
		const play = plays[perf.playID];
		let thisAmount = getAmount(play, perf);

		volumnCredits += Math.max(perf.audience - 30, 0);

		if ("comedy" === play.type) volumnCredits + Math.floor(perf.audience / 5);

		result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
		totalAmount += thisAmount;
	}
	result += `Amount owed is ${format(totalAmount/100)}\n`;
	result += `You earned ${volumnCredits} credits\n`;
	return result;
}

function getAmount(play, aPerformance) {
	let amount = 0;

	switch (play.type) {
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
			throw new Error(`unknown type: ${play.type}`);
	}

	return amount;
}

function readJsonFileAndDeserialize(jsonFile) {
	let fs = require('fs');
	return JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
}

function should_get_corresponding_result_when_call_statement() {
	let invoice = readJsonFileAndDeserialize('invoices.json');
	let plays = readJsonFileAndDeserialize('plays.json');

	let expected = "Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 40 credits\n";
	console.log(statement(invoice, plays) === expected);
}

should_get_corresponding_result_when_call_statement();
