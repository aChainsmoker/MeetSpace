export interface BookingsFilter {
    roomSearchQuery?: string;
    capacity?: number;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    roomEquipmentsIds?: string[];
}
