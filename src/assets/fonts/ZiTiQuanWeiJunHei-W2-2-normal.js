﻿import { jsPDF } from 'jspdf'
var callAddFont = function () {
this.addFileToVFS('ZiTiQuanWeiJunHei-W2-2-normal.ttf', font);
this.addFont('ZiTiQuanWeiJunHei-W2-2-normal.ttf', 'ZiTiQuanWeiJunHei-W2-2', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])