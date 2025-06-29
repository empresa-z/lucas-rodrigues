import { NextRequest, NextResponse } from 'next/server';
import { trackMetaCapiEvent } from '../../lib/meta-capi';

interface CapiRequestBody {
	event_name: string;
	custom_data?: Record<string, string | number | boolean>;
	user_data?: {
		em?: string;
		ph?: string;
		fbc?: string;
		fbp?: string;
	};
}

export async function POST(request: NextRequest) {
	try {
		const body: CapiRequestBody = await request.json();
		const { event_name, custom_data, user_data } = body;

		// Get client information from headers
		const clientIp = request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			'127.0.0.1';
		const userAgent = request.headers.get('user-agent') || '';

		// Track the event using our server-side Meta CAPI utility
		const success = await trackMetaCapiEvent({
			event_name: event_name || 'PageView',
			custom_data: {
				...custom_data,
				source: 'client_side',
			},
			user_data: {
				client_ip_address: clientIp,
				client_user_agent: userAgent,
				...user_data,
			},
		});

		if (success) {
			return NextResponse.json({
				success: true,
				message: 'Meta CAPI event tracked successfully',
			});
		} else {
			return NextResponse.json(
				{ error: 'Failed to track Meta CAPI event' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Meta CAPI API Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
