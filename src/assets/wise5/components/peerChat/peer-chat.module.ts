import { NgModule } from '@angular/core';
import { PeerChatChatBoxComponent } from './peer-chat-chat-box/peer-chat-chat-box.component';
import { PeerChatMessageComponent } from './peer-chat-message/peer-chat-message.component';
import { PeerChatMessageInputComponent } from './peer-chat-message-input/peer-chat-message-input.component';
import { PeerChatMessagesComponent } from './peer-chat-messages/peer-chat-messages.component';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank/peer-chat-question-bank.component';
import { PeerChatMembersComponent } from './peer-chat-members/peer-chat-members.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { QuestionBankService } from './peer-chat-question-bank/questionBank.service';

@NgModule({
  declarations: [
    PeerChatChatBoxComponent,
    PeerChatMembersComponent,
    PeerChatMessageComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ],
  imports: [StudentTeacherCommonModule],
  exports: [
    PeerChatChatBoxComponent,
    PeerChatMembersComponent,
    PeerChatMessageComponent,
    PeerChatMessageInputComponent,
    PeerChatMessagesComponent,
    PeerChatQuestionBankComponent
  ],
  providers: [QuestionBankService]
})
export class PeerChatModule {}
