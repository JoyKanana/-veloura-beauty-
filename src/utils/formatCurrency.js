const shillingFormatter = new Intl.NumberFormat('en-KE', {
  maximumFractionDigits: 2,
})

function formatCurrency(amount) {
  return `KSh ${shillingFormatter.format(Number(amount))}`
}

export default formatCurrency
