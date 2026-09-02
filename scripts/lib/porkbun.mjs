const API_BASE = 'https://api.porkbun.com/api/json/v3';

function authBody(credentials, extra = {}) {
  return {
    apikey: credentials.apiKey,
    secretapikey: credentials.secretKey,
    ...extra,
  };
}

async function porkbunRequest(path, credentials, body = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authBody(credentials, body)),
  });

  const data = await response.json();

  if (data.status !== 'SUCCESS') {
    const message = data.message || JSON.stringify(data);
    throw new Error(`Porkbun API error: ${message}`);
  }

  return data;
}

export async function listDnsRecords(domain, credentials) {
  const data = await porkbunRequest(`/dns/retrieve/${domain}`, credentials);
  return data.records ?? [];
}

export async function findDnsRecord(domain, credentials, name, type) {
  const records = await listDnsRecords(domain, credentials);
  return records.find(
    (record) =>
      record.type === type &&
      (record.name === name ||
        record.name === `${name}.${domain}` ||
        record.name.endsWith(`.${name}`)),
  );
}

export async function createDnsRecord(domain, credentials, record) {
  return porkbunRequest(`/dns/create/${domain}`, credentials, record);
}

export async function deleteDnsRecord(domain, credentials, id) {
  return porkbunRequest(`/dns/delete/${domain}/${id}`, credentials);
}

export async function upsertCname(domain, credentials, subdomain, content, ttl) {
  const existing = await findDnsRecord(domain, credentials, subdomain, 'CNAME');

  if (existing) {
    if (existing.content === content) {
      return { action: 'unchanged', record: existing };
    }

    await porkbunRequest(`/dns/edit/${domain}/${existing.id}`, credentials, {
      type: 'CNAME',
      content,
      ttl,
      name: subdomain,
    });

    return { action: 'updated', record: { ...existing, content } };
  }

  const created = await createDnsRecord(domain, credentials, {
    name: subdomain,
    type: 'CNAME',
    content,
    ttl,
    notes: 'Managed by Garage CLI',
  });

  return { action: 'created', record: created };
}
