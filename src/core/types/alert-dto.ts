export class AlertDto {
	firebaseToken: string;
	pills: {
		name: string;
		pillId: number;
	}[];
}
