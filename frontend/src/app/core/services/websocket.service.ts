import { Injectable, NgZone } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null;
  private messageSubject = new Subject<any>();

  constructor(private ngZone: NgZone) {}

  /**
   * Connect to a conversation's WebSocket topic.
   * Returns an Observable that emits each incoming message.
   */
  connect(conversationId: string, token: string): Observable<any> {
    this.disconnect();
    this.messageSubject = new Subject<any>();

    this.client = new Client({
      webSocketFactory: () => new (SockJS as any)('http://localhost:8081/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        this.client!.subscribe(
          `/topic/conversation/${conversationId}`,
          (frame) => {
            this.ngZone.run(() => {
              try {
                this.messageSubject.next(JSON.parse(frame.body));
              } catch (e) { /* ignore parse errors */ }
            });
          }
        );
      },
      onStompError: (frame) => {
        console.warn('WebSocket STOMP error:', frame.headers['message']);
      }
    });

    this.client.activate();
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }
}
