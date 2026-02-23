import { Response } from 'express';

interface SSEClient {
    id: string;
    res: Response;
}

let clients: SSEClient[] = [];

export function addSSEClient(id: string, res: Response): void {
    clients.push({ id, res });
    console.log(`[SSE] Client connected: ${id}. Total: ${clients.length}`);
}

export function removeSSEClient(id: string): void {
    clients = clients.filter((c) => c.id !== id);
    console.log(`[SSE] Client disconnected: ${id}. Total: ${clients.length}`);
}

export function broadcastEvent(event: string, data: unknown): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach((client) => {
        try {
            client.res.write(payload);
        } catch {
            removeSSEClient(client.id);
        }
    });
}
