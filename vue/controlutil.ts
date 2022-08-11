import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {

printHtml(picData: any , title: any) {
    html2canvas(picData).then((canvas) => {
        const contentWidth = canvas.width ;
        const contentHeight = canvas.height ;
        // 一页pdf显示html页面生成的canvas高度;
        const pageHeight = contentWidth / 592.28 * 841.89;
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight;
        // 页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 592.28;
        const imgHeight = (592.28 / contentWidth * contentHeight) + 100;
        const pageData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF(undefined, 'pt', 'a4');
        if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        } else {
            while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                if (leftHeight > 0) {
                    pdf.addPage();
                }
            }
        }
        pdf.save(title + '.pdf');
    });
},

getCertificatePDF(picData: any , title: any, type: string) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    html2canvas(picData).then((canvas) => {
        const w = (type === '1' ? 210 - 280 : 210);
        const h = (type === '1' ? 297 - 140 : 297) ;

        const pageData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(pageData, 'JPEG', 0, 0, w, h);
        pdf.save(title + '.pdf');
    });
},

};
