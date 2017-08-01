import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'session-list.html'
})
export class SessionList {
  data = data;

  constructor(public navCtrl: NavController) {}

  addFavorite(timeSlot: any, session: any, slidingItem: any) {
    console.error('addFavorite', timeSlot, session, slidingItem);
  }

  openSession(session: any) {
    this.navCtrl.push('SessionDetail', session);
  }

  reload() {
    window.location.reload();
  }

}


const data = [
   {
      'time': '9:00 AM',
      'talks': [
         {
            'name': 'Introduction to Appcamp.io',
            'location': 'Room 2203',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Brandy Carnegie',
            'timestart': '05/17/2016 9:00',
            'timeend': '05/17/2016 9:30',
            'category': 'ionic'
         },
         {
            'name': 'Getting started with Ionic',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Max Lynx',
            'timestart': '05/17/2016 9:30',
            'timeend': '05/17/2016 9:45',
            'category': 'ionic'
         },
         {
            'name': 'Tooling for Ionic',
            'location': 'Room 2201',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Josh Babari',
            'timestart': '05/17/2016 9:45',
            'timeend': '05/17/2016 10:00',
            'category': 'tooling'
         }
      ]
   },
   {
      'time': '10:00 AM',
      'talks': [
         {
            'name': 'Getting started with Ionic',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'location': 'Room 2201',
            'speaker': 'Adam Badley',
            'timestart': '05/17/2016 10:00',
            'timeend': '05/17/2016 10:15',
            'category': 'ionic'
         },
         {
            'name': 'The evolution of Ionicons',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Ben Sparrow',
            'timestart': '05/17/2016 10:15',
            'timeend': '05/17/2016 10:30',
            'category': 'design'
         },
         {
            'name': 'Ionic.io Services',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Eric Bobbington',
            'timestart': '05/17/2016 10:30',
            'timeend': '05/17/2016 11:00',
            'category': 'services'
         }
      ]
   },
   {
      'time': '11:00 AM',
      'talks': [
         {
            'name': 'Ionic Workshop',
            'location': 'Room 2201',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Perry Governor',
            'timestart': '05/17/2016 11:00',
            'timeend': '05/17/2016 11:45',
            'category': 'workshop'
         },
         {
            'name': 'Community Interaction',
            'location': 'Room 2203',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Mike Hurtington',
            'timestart': '05/17/2016 11:45',
            'timeend': '05/17/2016 11:50',
            'category': 'communication'
         },
         {
            'name': 'Navigation in Ionic',
            'location': 'Room 2203',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Tim Lanchester',
            'timestart': '05/17/2016 11:50',
            'timeend': '05/17/2016 12:00',
            'category': 'navigation'
         }
      ]
   },
   {
      'time': '12:00 PM',
      'talks': [
         {
            'name': 'Lunch',
            'timestart': '05/17/2016 12:00',
            'timeend': '05/17/2016 13:00',
            'location': 'Auditorium',
            'description': 'Come grab lunch with all the Ionic fanatics and talk all things Ionic',
            'category': 'food'
         }
      ]
   },
   {
      'time': '1:00 PM',
      'talks': [
         {
            'name': 'Ionic in the Enterprise',
            'location': 'Room 2201',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Brody Kiddington',
            'timestart': '05/17/2016 13:00',
            'timeend': '05/17/2016 13:15',
            'category': 'communication'
         },
         {
            'name': 'Ionic Worldwide',
            'location': 'Room 2201',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Katie Kinder',
            'timestart': '05/17/2016 13:15',
            'timeend': '05/17/2016 13:30',
            'category': 'communication'
         },
         {
            'name': 'The Ionic package service',
            'location': 'Room 2203',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Dan Dalman',
            'timestart': '05/17/2016 13:30',
            'timeend': '05/17/2016 14:00',
            'category': 'services'
         }
      ]
   },
   {
      'time': '2:00 PM',
      'talks': [
         {
            'name': 'Push Notifications in Ionic',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Rudy Belfonte',
            'timestart': '05/17/2016 14:00',
            'timeend': '05/17/2016 14:30',
            'category': 'services'
         },
         {
            'name': 'Ionic Documentation',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Drew Rough',
            'timestart': '05/17/2016 14:30',
            'timeend': '05/17/2016 14:45',
            'category': 'documentation'
         },
         {
            'name': 'UX planning in Ionic',
            'location': 'Room 2203',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Ben Sparrow',
            'timestart': '05/17/2016 14:45',
            'timeend': '05/17/2016 15:00',
            'category': 'design'
         }
      ]
   },
   {
      'time': '3:00 PM',
      'talks': [
         {
            'name': 'Directives in Ionic',
            'location': 'Room 2201',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Max Lynx',
            'timestart': '05/17/2016 15:00',
            'timeend': '05/17/2016 15:30',
            'category': 'angular'
         },
         {
            'name': 'Mobile States',
            'location': 'Room 2202',
            'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
            'speaker': 'Tim Lanchester',
            'timestart': '05/17/2016 15:30',
            'timeend': '05/17/2016 15:45',
            'category': 'navigation'
         }
      ]
   },
    {
       'time': '4:00 PM',
       'talks': [
          {
             'name': 'Breakfast',
             'timestart': '05/17/2016 8:00',
             'timeend': '05/17/2016 9:00',
             'location': 'Main hallway',
             'category': 'food'
          }
       ]
    },
    {
       'time': '5:00 PM',
       'talks': [
          {
             'name': 'Introduction to Appcamp.io',
             'location': 'Room 2203',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Brandy Carnegie',
             'timestart': '05/17/2016 9:00',
             'timeend': '05/17/2016 9:30',
             'category': 'ionic'
          },
          {
             'name': 'Getting started with Ionic',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Max Lynx',
             'timestart': '05/17/2016 9:30',
             'timeend': '05/17/2016 9:45',
             'category': 'ionic'
          },
          {
             'name': 'Tooling for Ionic',
             'location': 'Room 2201',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Josh Babari',
             'timestart': '05/17/2016 9:45',
             'timeend': '05/17/2016 10:00',
             'category': 'tooling'
          }
       ]
    },
    {
       'time': '6:00 PM',
       'talks': [
          {
             'name': 'Getting started with Ionic',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'location': 'Room 2201',
             'speaker': 'Adam Badley',
             'timestart': '05/17/2016 10:00',
             'timeend': '05/17/2016 10:15',
             'category': 'ionic'
          },
          {
             'name': 'The evolution of Ionicons',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Ben Sparrow',
             'timestart': '05/17/2016 10:15',
             'timeend': '05/17/2016 10:30',
             'category': 'design'
          },
          {
             'name': 'Ionic.io Services',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Eric Bobbington',
             'timestart': '05/17/2016 10:30',
             'timeend': '05/17/2016 11:00',
             'category': 'services'
          }
       ]
    },
    {
       'time': '7:00 PM',
       'talks': [
          {
             'name': 'Ionic Workshop',
             'location': 'Room 2201',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Perry Governor',
             'timestart': '05/17/2016 11:00',
             'timeend': '05/17/2016 11:45',
             'category': 'workshop'
          },
          {
             'name': 'Community Interaction',
             'location': 'Room 2203',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Mike Hurtington',
             'timestart': '05/17/2016 11:45',
             'timeend': '05/17/2016 11:50',
             'category': 'communication'
          },
          {
             'name': 'Navigation in Ionic',
             'location': 'Room 2203',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Tim Lanchester',
             'timestart': '05/17/2016 11:50',
             'timeend': '05/17/2016 12:00',
             'category': 'navigation'
          }
       ]
    },
    {
       'time': '8:00 PM',
       'talks': [
          {
             'name': 'Lunch',
             'timestart': '05/17/2016 12:00',
             'timeend': '05/17/2016 13:00',
             'location': 'Auditorium',
             'description': 'Come grab lunch with all the Ionic fanatics and talk all things Ionic',
             'category': 'food'
          }
       ]
    },
    {
       'time': '9:00 PM',
       'talks': [
          {
             'name': 'Ionic in the Enterprise',
             'location': 'Room 2201',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Brody Kiddington',
             'timestart': '05/17/2016 13:00',
             'timeend': '05/17/2016 13:15',
             'category': 'communication'
          },
          {
             'name': 'Ionic Worldwide',
             'location': 'Room 2201',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Katie Kinder',
             'timestart': '05/17/2016 13:15',
             'timeend': '05/17/2016 13:30',
             'category': 'communication'
          },
          {
             'name': 'The Ionic package service',
             'location': 'Room 2203',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Dan Dalman',
             'timestart': '05/17/2016 13:30',
             'timeend': '05/17/2016 14:00',
             'category': 'services'
          }
       ]
    },
    {
       'time': '10:00 PM',
       'talks': [
          {
             'name': 'Push Notifications in Ionic',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Rudy Belfonte',
             'timestart': '05/17/2016 14:00',
             'timeend': '05/17/2016 14:30',
             'category': 'services'
          },
          {
             'name': 'Ionic Documentation',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Drew Rough',
             'timestart': '05/17/2016 14:30',
             'timeend': '05/17/2016 14:45',
             'category': 'documentation'
          },
          {
             'name': 'UX planning in Ionic',
             'location': 'Room 2203',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Ben Sparrow',
             'timestart': '05/17/2016 14:45',
             'timeend': '05/17/2016 15:00',
             'category': 'design'
          }
       ]
    },
    {
       'time': '11:00 PM',
       'talks': [
          {
             'name': 'Directives in Ionic',
             'location': 'Room 2201',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Max Lynx',
             'timestart': '05/17/2016 15:00',
             'timeend': '05/17/2016 15:30',
             'category': 'angular'
          },
          {
             'name': 'Mobile States',
             'location': 'Room 2202',
             'description': 'Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.',
             'speaker': 'Tim Lanchester',
             'timestart': '05/17/2016 15:30',
             'timeend': '05/17/2016 15:45',
             'category': 'navigation'
          }
       ]
    }
];
