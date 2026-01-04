import jsPDF from 'jspdf';

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  totalPrice: number;
  options?: {
    size?: string;
    flavor?: string;
    filling?: string;
    covering?: string;
    decoration?: string;
    layers?: string | number;
    theme?: string;
    color?: string;
    notes?: string;
  };
  customImage?: string;
  image?: string;
}

interface OrderData {
  customer: {
    name: string;
    phone: string;
  };
  delivery: {
    date: string;
    time: string;
    type?: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  notes?: string;
}

export const generateReceiptPdf = async (orderData: OrderData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 0;
  const margin = 15;

  // Cores
  const primaryColor: [number, number, number] = [232, 121, 174]; // Rosa #E879AE
  const secondaryColor: [number, number, number] = [139, 92, 246]; // Roxo
  const darkColor: [number, number, number] = [31, 31, 31];
  const grayColor: [number, number, number] = [107, 114, 128];
  const lightBg: [number, number, number] = [253, 242, 248]; // Rosa claro

  // Header com fundo colorido
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  // Título branco
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOCE ENCOMENDA', pageWidth / 2, 20, { align: 'center' });
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Comprovante de Envio', pageWidth / 2, 32, { align: 'center' });

  // Emoji de bolo (texto)
  pdf.setFontSize(20);
  pdf.text('🍰', margin, 25);
  pdf.text('🎂', pageWidth - margin - 10, 25);
  yPos = 55;

  // Data e hora em caixa
  pdf.setFillColor(...lightBg);
  pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 18, 3, 3, 'F');
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin + 8, yPos + 11);
  pdf.text(`Hora: ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth - margin - 45, yPos + 11);
  yPos += 28;

  // Seção: Dados do Cliente
  pdf.setFillColor(...primaryColor);
  pdf.rect(margin, yPos, 4, 20, 'F');
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DADOS DO CLIENTE', margin + 10, yPos + 6);
  pdf.setTextColor(...darkColor);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Nome: ${orderData.customer.name}`, margin + 10, yPos + 14);
  pdf.text(`Telefone: ${orderData.customer.phone}`, pageWidth / 2, yPos + 14);
  yPos += 28;

  // Seção: Dados da Entrega
  pdf.setFillColor(...secondaryColor);
  pdf.rect(margin, yPos, 4, 28, 'F');
  pdf.setTextColor(...secondaryColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DADOS DA ENTREGA', margin + 10, yPos + 6);
  pdf.setTextColor(...darkColor);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Data: ${orderData.delivery.date}`, margin + 10, yPos + 14);
  pdf.text(`Hora: ${orderData.delivery.time}`, pageWidth / 2, yPos + 14);
  pdf.text(`Endereco: ${orderData.delivery.address}`, margin + 10, yPos + 22);
  yPos += 38;

  // Linha divisória estilizada
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.5);
  pdf.setLineDashPattern([3, 2], 0);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  pdf.setLineDashPattern([], 0);
  yPos += 10;

  // Seção: Itens do Pedido
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ITENS DO PEDIDO', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  orderData.items.forEach((item, index) => {
    // Verificar se precisa de nova página
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }

    // Card do item com fundo
    const itemStartY = yPos;
    let itemHeight = 20;

    // Calcular altura do card baseado nas opções
    if (item.options) {
      const optionsCount = Object.values(item.options).filter(v => v).length;
      itemHeight += optionsCount * 5;
    }

    // Se tiver imagem customizada, aumentar altura do card
    const hasCustomImage = item.customImage && item.customImage !== '/placeholder.svg';
    if (hasCustomImage) {
      itemHeight += 35;
    }

    pdf.setFillColor(250, 250, 250);
    pdf.roundedRect(margin, yPos, pageWidth - margin * 2, itemHeight, 2, 2, 'F');

    // Borda esquerda colorida
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos, 3, itemHeight, 'F');
    yPos += 6;

    // Nome do item
    pdf.setTextColor(...darkColor);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(`${index + 1}. ${item.name}`, margin + 8, yPos);

    // Preço alinhado à direita
    pdf.setTextColor(...primaryColor);
    pdf.text(`R$ ${(item.totalPrice * item.quantity).toFixed(2)}`, pageWidth - margin - 5, yPos, {
      align: 'right'
    });
    yPos += 5;

    // Adicionar imagem customizada se existir
    if (hasCustomImage && item.customImage) {
      try {
        pdf.addImage(item.customImage, 'JPEG', margin + 8, yPos, 30, 30);
        pdf.setDrawColor(...primaryColor);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin + 8, yPos, 30, 30, 2, 2, 'S');
        yPos += 33;
      } catch (e) {
        console.log('Erro ao adicionar imagem ao PDF:', e);
      }
    }

    pdf.setTextColor(...grayColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    if (item.options) {
      const optionsList: string[] = [];
      if (item.options.size) optionsList.push(`Tamanho: ${item.options.size}`);
      if (item.options.flavor) optionsList.push(`Sabor: ${item.options.flavor}`);
      if (item.options.filling) optionsList.push(`Recheio: ${item.options.filling}`);
      if (item.options.covering) optionsList.push(`Cobertura: ${item.options.covering}`);
      if (item.options.decoration) optionsList.push(`Decoracao: ${item.options.decoration}`);
      if (item.options.layers) optionsList.push(`Andares: ${item.options.layers}`);
      if (item.options.theme) optionsList.push(`Tema: ${item.options.theme}`);
      if (item.options.color) optionsList.push(`Cor: ${item.options.color}`);
      
      optionsList.forEach(opt => {
        pdf.text(`• ${opt}`, margin + 8, yPos);
        yPos += 5;
      });
      
      if (item.options.notes) {
        pdf.text(`• Obs: ${item.options.notes}`, margin + 8, yPos);
        yPos += 5;
      }
    }
    
    pdf.text(`Qtd: ${item.quantity}`, margin + 8, yPos);
    yPos = itemStartY + itemHeight + 5;
  });
  
  yPos += 5;

  // Caixa do Total
  pdf.setFillColor(...primaryColor);
  pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 22, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', margin + 15, yPos + 14);
  pdf.setFontSize(16);
  pdf.text(`R$ ${orderData.total.toFixed(2)}`, pageWidth - margin - 15, yPos + 14, {
    align: 'right'
  });
  yPos += 32;

  // Observações
  if (orderData.notes) {
    pdf.setTextColor(...grayColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Observacoes: ${orderData.notes}`, margin, yPos);
    yPos += 12;
  }

  // Rodapé
  const footerY = pageHeight - 25;
  pdf.setDrawColor(...lightBg);
  pdf.setLineWidth(0.5);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Obrigado pela preferencia!', pageWidth / 2, footerY + 3, { align: 'center' });
  pdf.setTextColor(...grayColor);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Doce Encomenda - Bolos e Doces Artesanais', pageWidth / 2, footerY + 10, { align: 'center' });

  // Salvar PDF
  pdf.save(`comprovante-envio-${new Date().toISOString().split('T')[0]}.pdf`);
};
