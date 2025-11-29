import { supabase } from "./supabaseClient";

interface CachedSession {
    userId: string;
    date: string;
    sessionId: string;
}

export class TelemetryService {
    private cachedSession?: CachedSession;

    public async recordReviewEvent(
        userId: string | undefined,
        eventType: string,
        payload: Record<string, any>,
        resultSummary?: string
    ) {
        const resolvedUserId = userId;
        if (!resolvedUserId) {
            return;
        }

        try {
            const sessionId = await this.ensureSession(resolvedUserId);
            if (!sessionId) {
                return;
            }

            const trimmedSummary = resultSummary ? resultSummary.slice(0, 1000) : undefined;
            const { error } = await supabase
                .from("review_events")
                .insert({
                    session_id: sessionId,
                    event_type: eventType,
                    payload,
                    result_summary: trimmedSummary,
                });

            if (error) {
                console.warn("Telemetry: failed to insert review event", error);
                throw error;
            }
        } catch (error) {
            console.warn("Telemetry: unexpected error while logging review event", error);
            throw error;
        }
    }

    private async ensureSession(userId: string): Promise<string | undefined> {
        const today = new Date().toISOString().slice(0, 10);
        if (this.cachedSession && this.cachedSession.userId === userId && this.cachedSession.date === today) {
            return this.cachedSession.sessionId;
        }

        const { data, error } = await supabase
            .from("work_sessions")
            .select("id")
            .eq("user_id", userId)
            .eq("session_date", today)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.warn("Telemetry: failed to fetch existing work session", error);
            throw error;
        }

        if (data?.id) {
            this.cachedSession = { userId, date: today, sessionId: data.id };
            return data.id;
        }

        const { data: inserted, error: insertError } = await supabase
            .from("work_sessions")
            .insert({
                user_id: userId,
                session_date: today,
                started_at: new Date().toISOString(),
            })
            .select("id")
            .single();

        if (insertError) {
            console.warn("Telemetry: failed to create work session", insertError);
            throw insertError;
        }

        if (inserted?.id) {
            this.cachedSession = { userId, date: today, sessionId: inserted.id };
            return inserted.id;
        }

        throw new Error("Telemetry: work session insert did not return an id");
    }
}
