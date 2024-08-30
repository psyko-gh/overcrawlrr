import { fromHumanReadableScore } from '@core/lib/rules/predicate/score';
import { fromHumanReadableNumber } from '@core/lib/rules/predicate/number';
import { fromHumanReadableDuration } from '@core/lib/rules/predicate/time';
import { fromHumanReadableBoolean } from '@core/lib/rules/predicate/boolean';

describe('fromHumanReadableNumber', () => {
    it('should match', async () => {
        expect(fromHumanReadableNumber('above 7')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableNumber('above 7.0')).toEqual({ threshold: 7.0, operator: 'gt' });

        expect(fromHumanReadableNumber('greater than 47')).toEqual({ threshold: 47, operator: 'gt' });
        expect(fromHumanReadableNumber('greater than 5768.5')).toEqual({ threshold: 5768.5, operator: 'gt' });

        expect(fromHumanReadableNumber('below 123')).toEqual({ threshold: 123, operator: 'lt' });
        expect(fromHumanReadableNumber('below 32.25')).toEqual({ threshold: 32.25, operator: 'lt' });

        expect(fromHumanReadableNumber('under 47')).toEqual({ threshold: 47, operator: 'lt' });
        expect(fromHumanReadableNumber('under 78.9')).toEqual({ threshold: 78.9, operator: 'lt' });

        expect(fromHumanReadableNumber('less than 1234')).toEqual({ threshold: 1234, operator: 'lt' });
        expect(fromHumanReadableNumber('less than 45.86')).toEqual({ threshold: 45.86, operator: 'lt' });
    });
});

describe('fromHumanReadableScore', () => {
    it('should match', async () => {
        expect(fromHumanReadableScore('above 7')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('above 7.0')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('above 7.05')).toEqual({ threshold: 7.05, operator: 'gt' });
        expect(fromHumanReadableScore('above 7/10')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('above 7/100')).toEqual({ threshold: 0.7, operator: 'gt' });
        expect(fromHumanReadableScore('above 77.0')).toEqual({ threshold: 77, operator: 'gt' });

        expect(fromHumanReadableScore('greater than 7')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('greater than 7.0')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('greater than 7.05')).toEqual({ threshold: 7.05, operator: 'gt' });
        expect(fromHumanReadableScore('greater than 7/10')).toEqual({ threshold: 7, operator: 'gt' });
        expect(fromHumanReadableScore('greater than 77.0')).toEqual({ threshold: 77, operator: 'gt' });

        expect(fromHumanReadableScore('below 4')).toEqual({ threshold: 4, operator: 'lt' });
        expect(fromHumanReadableScore('below 5.0')).toEqual({ threshold: 5.0, operator: 'lt' });
        expect(fromHumanReadableScore('below 5.3')).toEqual({ threshold: 5.3, operator: 'lt' });
        expect(fromHumanReadableScore('below 85/100')).toEqual({ threshold: 8.5, operator: 'lt' });
        expect(fromHumanReadableScore('below 77.0')).toEqual({ threshold: 77, operator: 'lt' });

        // Invalid format. Using numerator
        expect(fromHumanReadableScore('below 85/10')).toEqual({ threshold: 85, operator: 'lt' });
    });
});

describe('fromHumanReadableDuration', () => {
    it('should match', async () => {
        expect(fromHumanReadableDuration('less than 1 minute')).toEqual({ threshold: 60, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 minutes')).toEqual({ threshold: 60, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 100 minute')).toEqual({ threshold: 100 * 60, operator: 'lt' });

        expect(fromHumanReadableDuration('more than 1 minute')).toEqual({ threshold: 60, operator: 'gt' });
        expect(fromHumanReadableDuration('more than 1 minutes')).toEqual({ threshold: 60, operator: 'gt' });
        expect(fromHumanReadableDuration('more than 100 minute')).toEqual({ threshold: 100 * 60, operator: 'gt' });

        expect(fromHumanReadableDuration('less than 1 hour')).toEqual({ threshold: 60 * 60, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 hours')).toEqual({ threshold: 60 * 60, operator: 'lt' });
        expect(fromHumanReadableDuration('more than 2.5 hours')).toEqual({ threshold: 150 * 60, operator: 'gt' });
        expect(fromHumanReadableDuration('less than 2.5 hour')).toEqual({ threshold: 150 * 60, operator: 'lt' });

        expect(fromHumanReadableDuration('less than 1 day')).toEqual({ threshold: 60 * 60 * 24, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 days')).toEqual({ threshold: 60 * 60 * 24, operator: 'lt' });
        expect(fromHumanReadableDuration('more than 2.5 days')).toEqual({ threshold: 60 * 60 * 60, operator: 'gt' });
        expect(fromHumanReadableDuration('less than 2.5 day')).toEqual({ threshold: 60 * 60 * 60, operator: 'lt' });

        expect(fromHumanReadableDuration('less than 1 week')).toEqual({ threshold: 60 * 60 * 24 * 7, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 weeks')).toEqual({ threshold: 60 * 60 * 24 * 7, operator: 'lt' });
        expect(fromHumanReadableDuration('more than 2.5 weeks')).toEqual({ threshold: 60 * 60 * 24 * (7 * 2.5), operator: 'gt' });
        expect(fromHumanReadableDuration('less than 2.5 week')).toEqual({ threshold: 60 * 60 * 24 * (7 * 2.5), operator: 'lt' });

        expect(fromHumanReadableDuration('less than 1 month')).toEqual({ threshold: 60 * 60 * 24 * 30, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 months')).toEqual({ threshold: 60 * 60 * 24 * 30, operator: 'lt' });
        expect(fromHumanReadableDuration('more than 2.5 months')).toEqual({ threshold: 60 * 60 * 24 * 75, operator: 'gt' });
        expect(fromHumanReadableDuration('less than 2.5 month')).toEqual({ threshold: 60 * 60 * 24 * 75, operator: 'lt' });

        expect(fromHumanReadableDuration('less than 1 year')).toEqual({ threshold: 60 * 60 * 24 * 365, operator: 'lt' });
        expect(fromHumanReadableDuration('less than 1 years')).toEqual({ threshold: 60 * 60 * 24 * 365, operator: 'lt' });
        expect(fromHumanReadableDuration('more than 2.5 years')).toEqual({ threshold: 60 * 60 * 24 * (365 * 2.5), operator: 'gt' });
        expect(fromHumanReadableDuration('less than 2.5 year')).toEqual({ threshold: 60 * 60 * 24 * (365 * 2.5), operator: 'lt' });
    });
});

describe('fromHumanReadableBoolean', () => {
    it('should match', async () => {
        expect(fromHumanReadableBoolean('yes')).toEqual(true);
        expect(fromHumanReadableBoolean('true')).toEqual(true);
        expect(fromHumanReadableBoolean('1')).toEqual(true);

        expect(fromHumanReadableBoolean('no')).toEqual(false);
        expect(fromHumanReadableBoolean('false')).toEqual(false);
        expect(fromHumanReadableBoolean('0')).toEqual(false);
        expect(fromHumanReadableBoolean('abc')).toEqual(false);
    });
});
