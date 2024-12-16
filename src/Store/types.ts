export interface User {
	id: string;
	email: string;
	link_avatar: string;
	name: string;
	username: string;
	password: string | undefined;
	is_active: boolean | null;
	is_confirmed: boolean;
	createdAt: string;
	updatedAt: string;
  }