#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Feature: Sample

    Background:
        Given I have deployed the business network definition ..
        And I have added the following participant of type org.xuyuntech.health.Patient
          |participantKey | phone | name|
          |5671 | 13333333333|张三|
        And I have added the following participant of type org.xuyuntech.health.Doctor
          |participantKey | phone | name| title | description |
          |5672           | 13333333333|李四| 主任医师 | 全科|
        And I have added the following participant of type org.xuyuntech.health.Hospital
          |id|name|
          |1 | 大铁棍子医院|
        And I have added the following asset of type org.xuyuntech.health.RegisterHistory
            | id  | state | created | patient | arrangementHistory |
            |1234|Register|2018-06-22T11:17:43.855Z|resource:org.xuyuntech.health.Patient#5671|resource:org.xuyuntech.health.ArrangementHistory#4313|

    Scenario: 
        When I submit the following transaction of type org.xuyuntech.health.visiting
        | registerHistory|
        |1234|

        Then I should have the following assets of type org.xuyuntech.health.RegisterHistory
            | id  | state | created | patient | arrangementHistory |
            |1234|Visiting|2018-06-22T11:17:43.855Z|resource:org.xuyuntech.health.Patient#5671|resource:org.xuyuntech.health.ArrangementHistory#4313|
    

    Scenario: 
        When I submit the following transaction of type org.xuyuntech.health.visiting
            | registerHistory|
            |1234|

        When I submit the following transaction of type org.xuyuntech.health.Prescribe
            | registerHistory| participantKey | patient | doctor | hospital | complained | number | diagnose | history | familyHistory | created | 
            |1234| 1 | 5671 | 5672|1|123|123|123|123|123|2018-06-22T11:17:43.855Z|
        # Then I should have the following assets
        # """
        # [
        # {"$class":"org.xuyuntech.health.CaseItem","participantKey":"1", "patient":"resource:org.xuyuntech.health.Patient#5671","doctor":"resource:org.xuyuntech.health.Doctor#5672","hospital":"resource:org.xuyuntech.health.Hospital#1", "complained":"123", "number":"123" , "diagnose":"123" , "history":"123", "familyHistory":"123" ,"created":"2018-06-22T11:17:43.855Z"}
        # ]
        # """
        Then I should have the following assets of type org.xuyuntech.health.CaseItem
        | participantKey | patient | doctor | hospital | complained | number | diagnose | history | familyHistory | created | 
        | 1 | 5671| 5672|1|123|123|123|123|123|2018-06-22T11:17:43.855Z|

    
        