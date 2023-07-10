import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    constructor() { }

    public async generatePdf(data: any) {
        console.log(data);
        var dd = {
            content: [
                {
                    columns: [
                        {
                            image: await this.getBase64ImageFromURL("../../../../../assets/images/logo.png"),
                            width: 150,
                        },
                        [
                            {
                                text: 'Receipt',
                                color: '#333333',
                                width: '*',
                                fontSize: 28,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 0, 0, 15],
                            },
                            {
                                stack: [
                                    {
                                        columns: [
                                            {
                                                text: 'Vendor Name',
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: data.vendorDetails[0].firstName + ' ' + data.vendorDetails[0].lastName,
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                margin: [0, 0, 5, 5],
                                                alignment: 'left',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Request No.',
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: data.requestNumber,
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                margin: [0, 0, 0, 5],
                                                alignment: 'left',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Status',
                                                color: '#aaaaab',
                                                bold: true,
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: '*',
                                            },
                                            {
                                                text: 'Approved',
                                                bold: true,
                                                fontSize: 14,
                                                alignment: 'left',
                                                color: 'green',
                                                width: 100,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    ],
                },
                '\n\n',
                {
                    columns: [
                        {
                            text: 'PickUp Location',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 14,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                        {
                            text: 'DropOff Location',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 14,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                    ],
                },
                {
                    columns: [
                        {
                            text: data.pickupLocation.address,
                            style: 'invoiceBillingAddress',
                        },
                        {
                            text: data.dropOffLocation.address,
                            style: 'invoiceBillingAddress',
                        },
                    ],
                },
                '\n\n',
                {
                    width: '100%',
                    alignment: 'center',
                    text: 'Invoice Number ' + data.requestId,
                    bold: true,
                    margin: [0, 10, 0, 10],
                    fontSize: 15,
                },
                {
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return '#eaeaea';
                        },
                        vLineColor: function (i, node) {
                            return '#eaeaea';
                        },
                        hLineStyle: function (i, node) {
                            // if (i === 0 || i === node.table.body.length) {
                            return null;
                            //}
                        },
                        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                        paddingLeft: function (i, node) {
                            return 10;
                        },
                        paddingRight: function (i, node) {
                            return 10;
                        },
                        paddingTop: function (i, node) {
                            return 3;
                        },
                        paddingBottom: function (i, node) {
                            return 3;
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return '#fff';
                        },
                    },
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],
                        body: [
                            [
                                {
                                    text: 'Distance',
                                    bold: true,
                                    border: [false, true, false, true],
                                    alignment: 'left',
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    border: [false, true, false, true],
                                    text: data.distanceKM + ' KM',
                                    alignment: 'right',
                                    fillColor: '#f5f5f5',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Duration (in mins)',
                                    bold: true,
                                    border: [false, false, false, true],
                                    alignment: 'left',
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    text: data.durationInMins,
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    alignment: 'right',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                            [
                                {
                                    text: 'Total Amount',
                                    bold: true,
                                    fontSize: 20,
                                    alignment: 'left',
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                },
                                {
                                    text: '₹ ' + data.vendorDetails[0].totalAmount,
                                    bold: true,
                                    fontSize: 20,
                                    alignment: 'right',
                                    border: [false, false, false, true],
                                    fillColor: '#f5f5f5',
                                    margin: [0, 5, 0, 5],
                                },
                            ],
                        ],
                    },
                },
                '\n\n',
                {
                    text: 'NOTES',
                    style: 'notesTitle',
                },
                {
                    text: 'Some notes goes here \n Notes second line',
                    style: 'notesText',
                },
            ],
            styles: {
                notesTitle: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 50, 0, 3],
                },
                notesText: {
                    fontSize: 10,
                },
            },
            defaultStyle: {
                columnGap: 20,
                //font: 'Quicksand',
            },
        };

        return dd;
    }

    async getBase64ImageFromURL(url) {
        debugger;
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute("crossOrigin", "anonymous");

            img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var dataURL = canvas.toDataURL("image/png");
                resolve(dataURL);
            };

            img.onerror = error => {
                reject(error);
            };

            img.src = url;
        });
    }
}
