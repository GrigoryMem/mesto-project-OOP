import validate from 'validate.js';
import { IUser, IUserData, TUserPublicInfo } from '../types';
import { IEvents } from './base/events';
import { constraintsAvatar, constraintsUser } from '../utils/constants';

export class UserData implements IUserData{
	protected name: string;
	protected about: string;
	protected avatar: string;
	protected _id: string;
	protected cohort: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}
	getUserInfo(): TUserPublicInfo {
		return { name: this.name, about: this.about, avatar: this.avatar };
	}

	setUserInfo(userData: IUser) {
		this.about = userData.about;
		this.avatar = userData.avatar;
		this.cohort = userData.cohort;
		this._id = userData._id;
		this.name = userData.name;
		this.events.emit('user:changed');
	}

	checkUserValidation(data: Record<keyof TUserPublicInfo, string>) {
		const isValid = !Boolean(validate(data, constraintsUser));
		return isValid;
	}

	checkAvatarValidation(data: Record<keyof TUserPublicInfo, string>) {
		const isValid = !Boolean(validate(data, constraintsAvatar));
		return isValid;
	}
//необходимо оптимизация switch и приведение  одной функции
	checkField(data: { field: keyof TUserPublicInfo; value: string }) {
		switch (data.field) {
			case 'about':
				return this.checkAbout(data.value);
			case 'name':
				return this.checkName(data.value);
			case 'avatar':
				return this.checkAvatar(data.value);
		}
	}	

	checkName(value: string) {
		const result = validate.single(value, constraintsUser.name);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

	checkAbout(value: string) {
		const result = validate.single(value, constraintsUser.about);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

	checkAvatar(value: string) {
		const result = validate.single(value, constraintsAvatar.avatar);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

	get id() {
		return this._id;
	}
}
