var pizza_salami = new Food("pizza_salami", 907, 41.3, 34.7, 95.9, 7, 5.7);
var patat_mayo = new Food("patat_mayo", 630, 40.1, 7, 58.4, 4.8, 0.3);
var appel = new Food("appel", 81, 0.3, 0.3, 17.6, 2.7, 0);
var shoarma = new Food("shoarma", 167, 9.7, 19.7, 0.4, 0.1, 1);
var krenten_bol = new Food("krenten_bol", 134, 1.3, 4.2, 25.5, 2.1, 0.46);
var zuurkool = new Food("zuurkool", 58, 0.3, 1.7, 11.2, 2, 1.3);
var rookworst = new Food("rookworst", 425, 37.6, 17.9, 3.4, 0.9, 3.07);
var pannenkoek = new Food("pannenkoek", 137, 3.4, 5.8, 20.4, 0.4, 0.38);
var aardappel = new Food("aardappel", 122, 0.4, 1.4, 26.7, 3, 0.1);
var rodekool = new Food("rodekool", 18, 0.1, 0.4, 3.6, 0.7, 0.23);
var broodjehamburger = new Food("broodjehamburger", 228, 8.3, 13, 24, 2.3, 2.92);
var ijsbergsla = new Food("ijsbergsla", 7, 0.1, 0.4, 0.8, 0.5, 0.02);
var slaolie = new Food("slaolie", 89, 9.9, 0, 0, 0, 0);
var azijn = new Food("azijn", 89, 9.9, 0, 0, 0, 0);
var ontbijtkoek = new Food("ontbijtkoek", 78, 0.3, 0.8, 17.7, 0.9, 0.15);

function Food(name, calories, vet, eiwit, koolhydraten, vezels, zout)
{
	this.name = name;
	this.energie = calories;
	this.vet = vet;
	this.eiwit = eiwit;
	this.koolhydraten = koolhydraten;
	this.vezels = vezels;
	this.zout = zout;
}
