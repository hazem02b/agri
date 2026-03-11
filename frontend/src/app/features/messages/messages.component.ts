import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { Message, Conversation } from '../../core/models/message.model';
import { User, UserRole } from '../../core/models/user.model';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SkeletonComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  conversations: Conversation[] = [];
  messages: Message[] = [];
  selectedConversation: Conversation | null = null;
  currentUser: User | null = null;
  newMessage = '';
  loading = true;
  sendingMessage = false;
  needsScroll = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadConversations();
    }
  }

  ngAfterViewChecked() {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  loadConversations() {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.messageService.getConversations()
      .subscribe({
        next: (conversations) => {
          this.conversations = conversations.sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading conversations:', error);
          this.loading = false;
        }
      });
  }

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.id);
  }

  loadMessages(conversationId: string) {
    this.messageService.getMessages(conversationId).subscribe({
      next: (messages) => {
        this.messages = messages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        this.needsScroll = true;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation || !this.currentUser) {
      return;
    }

    this.sendingMessage = true;
    this.messageService.sendMessage(
      this.selectedConversation.id,
      this.newMessage
    ).subscribe({
      next: () => {
        // Reload messages to get the updated conversation
        this.loadMessages(this.selectedConversation!.id);
        this.newMessage = '';
        this.sendingMessage = false;
        this.needsScroll = true;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.sendingMessage = false;
      }
    });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  isMyMessage(message: Message): boolean {
    return message.senderId === this.currentUser?.id;
  }

  formatTime(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    
    if (diff < 60000) {
      return 'À l\'instant';
    } else if (diff < 3600000) {
      return Math.floor(diff / 60000) + ' min';
    } else if (diff < 86400000) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }
  }

  getOtherPersonName(): string {
    if (!this.selectedConversation || !this.currentUser) return '';
    return this.currentUser.role === UserRole.CUSTOMER 
      ? this.selectedConversation.farmerName 
      : this.selectedConversation.customerName;
  }

  getLastMessage(conversation: Conversation): string {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'Aucun message';
    }
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return lastMsg.content || '';
  }

  getUnreadCount(conversation: Conversation): number {
    if (!conversation.messages || !this.currentUser) {
      return 0;
    }
    return conversation.messages.filter(
      msg => msg.senderId !== this.currentUser!.id && !msg.isRead
    ).length;
  }
}
