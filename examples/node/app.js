import { compute } from '../../lib/index.js';

const timeToEvents = [1, 12, 22, 29, 31, 36, 38, 50, 60, 61, 70, 88, 99, 110, 140];
const events = [
	false,
	true,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
	true,
	true,
	false,
	false,
	false,
	false,
];

const kmData = compute(timeToEvents, events);
console.table(kmData);
