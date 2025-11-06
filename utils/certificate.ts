export function generateCertificate(userName: string, courseName: string) {
  // Create a simple PDF-like certificate using canvas
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 800, 600)

  // Border
  ctx.strokeStyle = '#ec4899'
  ctx.lineWidth = 10
  ctx.strokeRect(20, 20, 760, 560)

  // Title
  ctx.fillStyle = '#1f2937'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Certificate of Completion', 400, 100)

  // Content
  ctx.font = '24px Arial'
  ctx.fillStyle = '#4b5563'
  ctx.fillText('This is to certify that', 400, 200)

  // Name
  ctx.font = 'bold 36px Arial'
  ctx.fillStyle = '#ec4899'
  ctx.fillText(userName, 400, 280)

  // Course
  ctx.font = '24px Arial'
  ctx.fillStyle = '#4b5563'
  ctx.fillText('has successfully completed the course', 400, 340)
  ctx.fillText(courseName, 400, 380)

  // Date
  ctx.font = '20px Arial'
  ctx.fillStyle = '#6b7280'
  ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 450)

  // Signature line
  ctx.strokeStyle = '#9ca3af'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(200, 520)
  ctx.lineTo(600, 520)
  ctx.stroke()
  ctx.font = '18px Arial'
  ctx.fillStyle = '#6b7280'
  ctx.fillText('Authorized Signature', 400, 550)

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Certificate_${userName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }, 'image/png')
}

