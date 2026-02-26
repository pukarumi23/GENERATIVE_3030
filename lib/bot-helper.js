/**
 * @param {Object} client 
 * @returns {string}
 */
export function getBotJid(client) {
  if (!client || !client.user) return null
  
  
  if (client.user.jid) return client.user.jid
  
 
  if (client.user.id) {
    const id = typeof client.user.id === 'string' 
      ? client.user.id 
      : client.user.id.toString()
    return id.includes('@') ? id : id.split(':')[0] + '@s.whatsapp.net'
  }
  
  
  if (client.user.lid) {
    return client.user.lid.includes('@') 
      ? client.user.lid 
      : client.user.lid + '@s.whatsapp.net'
  }
  
  return null
}
