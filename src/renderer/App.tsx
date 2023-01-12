import React, {useCallback, useEffect, useRef, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import styled, { css, createGlobalStyle } from 'styled-components'

const App = () => {
  // useEffect(() => {
  //   dayjs.extend(weekday);
  // }, []);

  const WEEKDAYS = useMemo(
    () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    [],
  );
  // const TODAY = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const [currentMonthYear, setCurrentMonthYear] = useState(() => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('M');
    return {year: currentYear, month: currentMonth};
  });

  const currentMonthText = useMemo(() => {
    return dayjs(
      new Date(parseInt(currentMonthYear.year), parseInt(currentMonthYear.month) - 1),
    ).format('MMMM YYYY');
  }, [currentMonthYear]);

  const monthDays = useMemo(() => {
    const currentMonthDays = createDaysForCurrentMonth(
      currentMonthYear.year,
      currentMonthYear.month,
    );
    const previousMonthDays = createDaysForPreviousMonth(
      currentMonthYear.year,
      currentMonthYear.month,
      currentMonthDays[0].dayOfWeek,
    );
    const nextMonthDays = createDaysForNextMonth(
      currentMonthYear.year,
      currentMonthYear.month,
      currentMonthDays[currentMonthDays.length - 1].dayOfWeek,
    );
    console.log('monthDays: ', [
      ...currentMonthDays,
      ...previousMonthDays,
      ...nextMonthDays,
    ]);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentMonthYear]);

  // ------------------ //
  // utility functions
  // ------------------ //
  function getNumberOfDaysInMonth(year: number, month: number) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

  function createDaysForCurrentMonth(year: number, month: number) {
    return [...Array(getNumberOfDaysInMonth(year, month))].map(
      (_day, index) => {
        return {
          date: dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD'),
          dayOfMonth: index + 1,
          dayOfWeek: dayjs(`${year}-${month}-${index + 1}`).day(),
          isCurrentMonth: true,
        };
      },
    );
  }

  function createDaysForPreviousMonth(year: number, month: number, currentMonthFirstDayOfWeek: number) {
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = currentMonthFirstDayOfWeek
      ? currentMonthFirstDayOfWeek - 1
      : 6;

    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthFirstDayOfWeek)
      .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
      .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
      (_day, index) => {
        return {
          date: dayjs(
            `${previousMonth.year()}-${previousMonth.month() + 1}-${
              previousMonthLastMondayDayOfMonth + index
            }`,
          ).format('YYYY-MM-DD'),
          dayOfMonth: previousMonthLastMondayDayOfMonth + index,
          isCurrentMonth: false,
        };
      },
    );
  }

  function createDaysForNextMonth(year: number, month: number, currentMonthLastDayOfWeek: number) {
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    console.log('currentMonthLastDayOfWeek: ', currentMonthLastDayOfWeek);
    const visibleNumberOfDaysFromNextMonth = 7 - currentMonthLastDayOfWeek;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`,
        ).format('YYYY-MM-DD'),
        dayOfMonth: index + 1,
        isCurrentMonth: false,
      };
    });
  }

  // const getWeekday = useCallback(date => {
  //   return dayjs(date).weekday();
  // }, []);

  // function initMonthSelectors() {
  //   document
  //     .getElementById('previous-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(selectedMonth).subtract(1, 'month');
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });

  //   document
  //     .getElementById('present-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });

  //   document
  //     .getElementById('next-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(selectedMonth).add(1, 'month');
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });
  // }

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <SidebarContainer>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarHeaderText}>Calendars</Text>
        </View>
        <View style={styles.sidebarCalendars}>
          <View style={styles.sidebarCalendar}>
            <View style={styles.sidebarCalendarGroupTitle}>
              <Text style={styles.sidebarCalendarGroupTitleText}>
                joylee@gmail.com
              </Text>
            </View>
            <View style={styles.sidebarCalendarGroup}>
              <View style={styles.sidebarCalendarItem}>
                <View
                  style={[
                    styles.sidebarCalendarColor,
                    {backgroundColor: 'blue'},
                  ]}></View>
                <Text style={styles.sidebarCalendarText}>Primary</Text>
              </View>
              <View style={styles.sidebarCalendarItem}>
                <View
                  style={[
                    styles.sidebarCalendarColor,
                    {backgroundColor: 'purple'},
                  ]}></View>
                <Text style={styles.sidebarCalendarText}>Holidays</Text>
              </View>
              <View style={styles.sidebarCalendarItem}>
                <View
                  style={[
                    styles.sidebarCalendarColor,
                    {backgroundColor: 'red'},
                  ]}></View>
                <Text style={styles.sidebarCalendarText}>Important</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <View style={styles.calendarHeaderLeft}>
            <Text style={styles.calendarHeaderMonthYear}>
              {currentMonthText}
            </Text>
          </View>
          <View style={styles.calendarHeaderRight}></View>
        </View>
        <View style={styles.daysOfWeek}>
          {WEEKDAYS.map(weekday => {
            return (
              <View style={styles.dayOfWeek}>
                <Text style={styles.dayOfWeekText}>{weekday}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.monthDays}>
          {monthDays?.map((day, i) => {
            return (
              <Pressable
                key={`monthDay-${i}`}
                style={[
                  styles.day,
                  {
                    width: `${(1 / 7) * 100}%`,
                    height: `${(1 / 6) * 100}%`,
                    backgroundColor: day.isCurrentMonth ? 'white' : 'lightgrey',
                  },
                ]}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <View style={styles.dayTextContainer}>
                  <Text>{day.dayOfMonth}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        {modalVisible ? (
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderRow}>
                  <View
                    style={[styles.modalCategory, {backgroundColor: 'white'}]}>
                    <Text style={styles.modalCategoryText}>Event</Text>
                  </View>
                  <View style={[styles.modalCategory]}>
                    <Text style={styles.modalCategoryText}>Task</Text>
                  </View>
                  <View style={[styles.modalCategory]}>
                    <Text style={styles.modalCategoryText}>Journal</Text>
                  </View>
                </View>
              </View>
              <View style={styles.modalBody}>
                <View style={styles.modalBodyRow}>
                  <TextInput
                    style={styles.modalBodyTitleInput}
                    placeholder={'Title'}
                  />
                </View>
                <View style={styles.modalBodyRow}>
                  <DateTimePicker />
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
    </>
  );
};

const GlobalStyle = createGlobalStyle`
  div {
    display: flex;
  }
`;
const Wrapper = styled.div`
  flex: 1;
  flex-direction: row;
`;
const SidebarContainer = styled.div`
  flex: 1;
  padding: 10px;
`;
const SidebarHeader = styled.div`
  padding: 10px 0;
`;
const SidebarHeaderText = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;
const SidebarCalendars = styled.div`
`;
const SidebarCalendar = styled.div`
`;
const SidebarCalendarGroupTitle = styled.div`
  margin-bottom: 5px;
`;
const SidebarCalendarGroupTitleText = styled.h6`
  font-size: 13px;
  font-weight: 400;
  color: #999999,
`;
const SidebarCalendarGroup = styled.div`
`;
const SidebarCalendarItem = styled.div`
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
`;
const SidebarCalendarColor = styled.div`
  border-radius: 4px;
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;
const SidebarCalendarText = styled.p`
  font-size: 13px;
`;
const CalendarContainer = styled.div`
  flex: 5;
  background-color: white;
`;
const CalendarHeader = styled.div`
  flex-direction: row;
  padding: 10px 0;
`;
const CalendarHeaderLeft = styled.div`
  flex: 1;
`;
const CalendarHeaderMonthYear = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
const CalendarHeaderRight = styled.div`
  flex: 1;
`;
const DaysOfWeek = styled.div`
  flex-direction: row;
`;
const DayOfWeek = styled.div`
  width: ((1 / 7) * 100) + '%';
  padding: 5px 0;
`;
  monthDays: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  dayTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 5,
  },
  day: {},
  modalBackdrop: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    alignItems: 'baseline',
    height: 400,
    width: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f2f2f2',
    padding: 10,
  },
  modalHeader: {},
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#f2f2f2',
    padding: 4,
    borderRadius: 4,
  },
  modalCategory: {
    width: 70,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  modalCategoryText: {
    fontSize: 15,
    fontWeight: '400',
  },
  modalBody: {
    paddingVertical: 10,
  },
  modalBodyRow: {
    width: '100%',
    flexDirection: 'row',
  },
  modalBodyTitleInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default App;
