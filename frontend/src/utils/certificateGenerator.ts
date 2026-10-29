/**
 * Generador de Certificado Digital en Alta Resolución (1920x1080 px)
 * Renderiza mediante Canvas 2D en memoria y dispara la descarga automática en PNG.
 */
export function downloadRescueCertificate(
  playerName: string,
  score: number,
  dateStr: string = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Fondo elegante marfil / pergamino
  const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1080);
  bgGrad.addColorStop(0, '#fcfaf7');
  bgGrad.addColorStop(0.5, '#f7f4ee');
  bgGrad.addColorStop(1, '#f1ede4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  // 2. Marco exterior color Pizarra
  ctx.strokeStyle = '#0f172a'; // slate-900
  ctx.lineWidth = 28;
  ctx.strokeRect(30, 30, 1920 - 60, 1080 - 60);

  // 3. Marco interior Oro
  ctx.strokeStyle = '#d97706'; // amber-600
  ctx.lineWidth = 8;
  ctx.strokeRect(55, 55, 1920 - 110, 1080 - 110);

  // Filete fino pizarra interno
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, 1920 - 140, 1080 - 140);

  // Esquinas ornamentales de oro
  const cornerSize = 40;
  ctx.fillStyle = '#d97706';
  [
    [70, 70],
    [1920 - 70 - cornerSize, 70],
    [70, 1080 - 70 - cornerSize],
    [1920 - 70 - cornerSize, 1080 - 70 - cornerSize],
  ].forEach(([x, y]) => {
    ctx.fillRect(x, y, cornerSize, cornerSize);
  });

  // 4. Cruz Médica Roja y Emblema Superior
  const centerX = 1920 / 2;
  const topY = 160;

  // Círculo dorado de soporte
  ctx.beginPath();
  ctx.arc(centerX, topY, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Cruz roja médica
  ctx.fillStyle = '#ef4444';
  // Barra vertical
  ctx.fillRect(centerX - 8, topY - 26, 16, 52);
  // Barra horizontal
  ctx.fillRect(centerX - 26, topY - 8, 52, 16);

  // 5. Textos y Tipografía
  ctx.textAlign = 'center';

  // Subtítulo superior institucional
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.fillText('MISIÓN RESCATE VETERINARIO • PROTOCOLO PASR', centerX, topY + 80);

  // Título Principal
  ctx.font = 'bold 52px serif';
  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.fillText('CERTIFICADO DE RESCATISTA CANINO OFICIAL', centerX, topY + 150);

  // Mención de Honor
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#d97706'; // oro
  ctx.fillText('RESCATISTA CANINO OFICIAL • PRIMER RESPONDIENTE', centerX, topY + 195);

  // Línea dorada divisoria
  ctx.beginPath();
  ctx.moveTo(centerX - 280, topY + 220);
  ctx.lineTo(centerX + 280, topY + 220);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Texto de acreditación
  ctx.font = 'italic 24px serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(
    'Por haber demostrado temple, pericia clínica y apego riguroso al protocolo PASR,',
    centerX,
    topY + 270
  );
  ctx.fillText(
    'salvando vidas en el campo de auxilio médico, se otorga la presente distinción oficial a:',
    centerX,
    topY + 305
  );

  // Nombre del Jugador
  const safePlayer = playerName.trim() || 'Rescatista Anónimo';
  ctx.font = 'bold 64px serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(safePlayer.toUpperCase(), centerX, topY + 400);

  // Línea ornamental bajo el nombre
  ctx.beginPath();
  ctx.moveTo(centerX - 350, topY + 425);
  ctx.lineTo(centerX + 350, topY + 425);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Resumen de Desempeño
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#059669'; // emerald-600
  ctx.fillText(`PUNTAJE DE EXCELENCIA: ${score} PUNTOS`, centerX, topY + 490);

  ctx.font = '500 20px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Expedido el ${dateStr}`, centerX, topY + 530);

  // 6. Sellos y Firmas Inferiores
  const footerY = 900;

  // Firma 1 (Izquierda)
  ctx.beginPath();
  ctx.moveTo(centerX - 550, footerY);
  ctx.lineTo(centerX - 250, footerY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('DRA. VALENTINA SOTO', centerX - 400, footerY + 28);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Dirección de Triage y Urgencias Veterinarias', centerX - 400, footerY + 50);

  // Sello Central de Oro y Rojo
  ctx.beginPath();
  ctx.arc(centerX, footerY - 20, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#d97706';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, footerY - 20, 52, 0, Math.PI * 2);
  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ACREDITADO', centerX, footerY - 24);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('PASR 2026', centerX, footerY - 8);

  // Firma 2 (Derecha)
  ctx.beginPath();
  ctx.moveTo(centerX + 250, footerY);
  ctx.lineTo(centerX + 550, footerY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('COMITÉ DE PRIMEROS AUXILIOS', centerX + 400, footerY + 28);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Brigada de Rescate Animal de Campo', centerX + 400, footerY + 50);

  // 7. Descarga automática
  const dataUrl = canvas.toDataURL('image/png');
  const safeFileName = safePlayer.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const link = document.createElement('a');
  link.download = `Certificado-PASR-${safeFileName}.png`;
  link.href = dataUrl;
  link.click();
}
