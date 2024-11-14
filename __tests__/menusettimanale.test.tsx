import { expect, test } from 'vitest';
import { GET } from '@/app/api/menusettimanale/[settimanaSelezionata]/route';

test ('GET', () =>{
    expect(GET()).toBe('');
});