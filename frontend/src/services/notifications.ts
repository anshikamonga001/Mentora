import api from './api';

export interface Notification {
  _id: string;
  type: 'new_question' | 'new_answer' | 'new_project' | 'system';
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  sender?: { name: string; avatar?: string };
}

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get('/notifications');
  return res.data.notifications;
};

export const markAsRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};
