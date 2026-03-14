export interface Participant {
  Name: string;
  Role: string;
}

export interface DiscussionPoint {
  Topic: string;
  Description: string;
  Action: string;
}

export interface ActionItem {
  Assignee: string;
  Description: string;
}

export interface MeetingSummary {
  MeetingInfo: {
    MeetingName: string;
    Date: string;
  };
  Participants: Participant[];
  Discussion: DiscussionPoint[];
  ActionItems: ActionItem[];
}
