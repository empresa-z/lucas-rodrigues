import { NextRequest, NextResponse } from 'next/server';
import { trackGAEvent } from '../../lib/google-analytics';

interface GARequestBody {
	event_name: string;
	parameters?: Record<string, string | number | boolean>;
	client_id: string;
	user_properties?: Record<string, { value: string | number | boolean }>;
}

export async function POST(request: NextRequest) {
	try {
		const body: GARequestBody = await request.json();
		const { event_name, parameters, client_id, user_properties } = body;

		if (!client_id) {
			return NextResponse.json(
				{ error: 'Client ID is required' },
				{ status: 400 }
			);
		}

		// Track the event using our server-side GA utility
		const success = await trackGAEvent(
			{
				name: event_name,
				parameters,
			},
			{
				client_id,
				user_properties,
			}
		);

		if (success) {
			return NextResponse.json({
				success: true,
				message: 'GA event tracked successfully',
			});
		} else {
			return NextResponse.json(
				{ error: 'Failed to track GA event' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('GA API Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
