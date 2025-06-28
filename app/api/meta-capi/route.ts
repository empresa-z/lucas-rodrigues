import { NextRequest, NextResponse } from 'next/server';

const PIXEL_ID = '1501515817485128';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

interface CapiEvent {
	event_name: string;
	event_time: number;
	user_data: {
		client_ip_address?: string;
		client_user_agent?: string;
		fbc?: string;
		fbp?: string;
		em?: string;
		ph?: string;
	};
	custom_data?: Record<string, string | number | boolean>;
	event_source_url?: string;
	action_source: string;
}

export async function POST(request: NextRequest) {
	try {
		if (!ACCESS_TOKEN) {
			console.error('META_CAPI_ACCESS_TOKEN is not configured');
			return NextResponse.json(
				{ error: 'CAPI access token not configured' },
				{ status: 500 }
			);
		}

		const body = await request.json();
		const { event_name, custom_data, user_data } = body;

		// Get client information from headers
		const clientIp = request.headers.get('x-forwarded-for') ||
			request.headers.get('x-real-ip') ||
			'127.0.0.1';
		const userAgent = request.headers.get('user-agent') || '';
		const referer = request.headers.get('referer') || '';

		// Prepare the event data
		const eventData: CapiEvent = {
			event_name: event_name || 'PageView',
			event_time: Math.floor(Date.now() / 1000),
			action_source: 'website',
			event_source_url: referer,
			user_data: {
				client_ip_address: clientIp,
				client_user_agent: userAgent,
				...user_data,
			},
			custom_data: custom_data || {},
		};

		// Send to Facebook Conversions API
		const capiResponse = await fetch(
			`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: [eventData],
					test_event_code: process.env.NODE_ENV === 'development' ? 'TEST12345' : undefined,
				}),
			}
		);

		const capiResult = await capiResponse.json();

		if (!capiResponse.ok) {
			console.error('CAPI Error:', capiResult);
			return NextResponse.json(
				{ error: 'Failed to send event to CAPI', details: capiResult },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Event sent successfully',
			capi_response: capiResult,
		});

	} catch (error) {
		console.error('CAPI API Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
